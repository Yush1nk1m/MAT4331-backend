import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { Logger } from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { Member } from '../member/member.entity';
import { Chatroom } from './chatroom.entity';
import { ChatroomService } from './chatroom.service';
import { MemberChatroomService } from '../member-chatroom/member-chatroom.service';
import { MemberChatroom } from '../member-chatroom/member-chatroom.entity';
import { jwtAccessOptions } from '../../config/jwt.config';

/**
 * @TODO refactor Redis subscribe/unsubscribe logic by tracking DB data instead of memory-based map
 */
@ApiTags('Chatroom')
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class ChatroomGateway implements OnGatewayConnection {
  private logger: Logger = new Logger(ChatroomGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly memberService: MemberService,
    private readonly chatroomService: ChatroomService,
    private readonly memberChatroomService: MemberChatroomService,
  ) {}

  /**
   * method for validating if the client's socket has access token
   * @param client client's socket
   */
  async validateClientToken(client: Socket): Promise<Member> {
    // extract token
    const token: string = client.handshake.auth.token as string;
    if (!token) {
      throw new Error('Access token does not exist');
    }

    this.logger.debug(`socket received access token: ${token}`);

    // validate token
    try {
      // decode JWT token
      const decoded: JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        jwtAccessOptions,
      );

      this.logger.debug(`decoded jwt token: ${JSON.stringify(decoded)}`);

      // verify if member exists
      const member: Member = await this.memberService.validateMemberById(
        decoded.sub,
      );

      this.logger.debug(`validated member: ${JSON.stringify(member)}`);

      // return found member
      return member;
    } catch (error) {
      throw new Error(`Failed to verify access token: ${error.message}`);
    }
  }

  /**
   * method for validating if the client has joined to the chatroom
   * @param client client's socket
   * @param chatroomId chatroom's id
   */
  async validateParticipation(
    client: Socket,
    chatroomId: string,
  ): Promise<void> {
    // validate the access token and get Member instance
    const member: Member = await this.validateClientToken(client);

    // find chatroom and validate if it exists
    const chatroom: Chatroom = await this.chatroomService.validateChatroomById(
      Number(chatroomId),
    );

    // find MemberChatroom to validate member's participation
    const memberChatroom: MemberChatroom =
      await this.memberChatroomService.findMemberChatroomByMemberAndChatroom(
        member,
        chatroom,
      );

    if (!memberChatroom) {
      throw new Error(
        `Member has not joined the chatroom with id: ${chatroomId}`,
      );
    }
  }

  /**
   * method for validating client's socket connection by checking the access token
   * @param client client's socket
   */
  @ApiOperation({
    summary: '[WS-01] 웹 소켓 연결',
    description: 'WebSocket으로 클라이언트와 서버가 연결된다.',
  })
  async handleConnection(client: Socket): Promise<void> {
    try {
      const member: Member = await this.validateClientToken(client);
      this.logger.debug(`connected member: ${JSON.stringify(member)}`);
    } catch (error) {
      this.logger.debug(`Socket Connection Error: ${error}`);
      client.disconnect();
    }
  }

  @ApiOperation({
    summary: '[WS-02] 채팅방 연결',
    description: 'WebSocket으로 채팅방에 연결한다.',
  })
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, chatroomId: string) {
    try {
      // validate if the access token exists and if the client has joined the chatroom
      await this.validateParticipation(client, chatroomId);

      // join member to the chatroom through Socket.io
      await client.join(chatroomId);

      this.logger.debug(`client joined the chatroom id: ${chatroomId}`);
    } catch (error) {
      client.emit('error', {
        message: `Error occurred while joining chatroom: ${error.message}`,
      });
    }
  }

  @ApiOperation({
    summary: '[WS-03] 채팅방 연결 해제',
    description: 'WebSocket으로 연결되어 있었던 채팅방과의 연결을 해제한다.',
  })
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(client: Socket, chatroomId: string) {
    try {
      // leave room through Socket.io
      await client.leave(chatroomId);
    } catch (error) {
      client.emit('error', {
        message: `error occurred while leaving chatroom: ${error.message}`,
      });
    }
  }
}
