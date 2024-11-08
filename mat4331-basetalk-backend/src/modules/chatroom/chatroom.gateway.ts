import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { RedisService } from '../redis/redis.service';
import { ChatroomService } from './chatroom.service';
import { Socket } from 'socket.io';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { jwtAccessOptions } from '../../config/jwt.config';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { MemberService } from '../member/member.service';
import { Member } from '../member/member.entity';
import { Chatroom } from './chatroom.entity';
import { MemberChatroomService } from '../member-chatroom/member-chatroom.service';
import { Transactional } from 'typeorm-transactional';

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
export class ChatroomGateway {
  private logger: Logger = new Logger(ChatroomGateway.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly chatroomService: ChatroomService,
    private readonly memberService: MemberService,
    private readonly memberChatroomService: MemberChatroomService,
  ) {}

  /**
   * utility method for extracting JWT access token's payload
   * @param client Web socket
   * @returns access token's payload
   */
  async parseTokenFromSocket(client: Socket): Promise<JwtPayload> {
    // get JWT access token from the socket
    const token: string = client.handshake.auth.token as string;

    // if the token does not exist, throw error
    if (!token) throw new UnauthorizedException('Token not found');

    // decode and return the token
    try {
      const decoded: JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        jwtAccessOptions,
      );

      return decoded;
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }

  @ApiOperation({
    summary: '[WS-CR-01] 채팅방 입장',
    description: '새로운 채팅방에 입장한다.',
  })
  @SubscribeMessage('joinRoom')
  @Transactional()
  async handleJoinRoom(client: Socket, chatroomId: string) {
    try {
      // save to the DB that member has joined the chatroom

      // extract JWT payload
      const token: JwtPayload = await this.parseTokenFromSocket(client);

      // find member and chatroom
      const member: Member = await this.memberService.findMemberById(token.sub);
      if (!member) {
        throw new NotFoundException(
          `Member with id: ${token.sub} has not found`,
        );
      }

      const chatroom: Chatroom = await this.chatroomService.findChatroomById(
        Number(chatroomId),
      );
      if (!chatroom) {
        throw new NotFoundException(
          `Chatroom with id: ${chatroomId} has not found`,
        );
      }

      // join member to chatroom
      await this.memberChatroomService.joinMemberToChatroom(member, chatroom);

      // subscribe Redis channel and register onChat handler
      await this.redisService.subscribeToChannel(
        `chatroom:${chatroomId}`,
        (chat) => {
          client.to(chatroomId).emit('chat', JSON.parse(chat));
        },
      );

      // join member to the chatroom through Socket.io
      await client.join(chatroomId);

      // send join message to the chatroom
      client
        .to(chatroomId)
        .emit('chat', `${token.nickname}님께서 입장하셨습니다.`);
    } catch (error) {
      client.emit('error', {
        message: 'error occurred joining the chatroom',
      });
    }
  }

  @ApiOperation({
    summary: '[WS-CR-02] 채팅방 퇴장',
    description: '입장해 있었던 채팅방에서 퇴장한다.',
  })
  @SubscribeMessage('leaveRoom')
  @Transactional()
  async handleLeaveRoom(client: Socket, chatroomId: string) {
    try {
      // save to the DB that member has left the chatroom

      // extract JWT payload
      const token: JwtPayload = await this.parseTokenFromSocket(client);

      // find member and chatroom
      const member: Member = await this.memberService.findMemberById(token.sub);
      if (!member) {
        throw new NotFoundException(
          `Member with id: ${token.sub} has not found`,
        );
      }

      const chatroom: Chatroom = await this.chatroomService.findChatroomById(
        Number(chatroomId),
      );
      if (!chatroom) {
        throw new NotFoundException(
          `Chatroom with id: ${chatroomId} has not found`,
        );
      }

      // delete MemberChatroom information
      await this.memberChatroomService.leaveMemberFromChatroom(
        member,
        chatroom,
      );

      // check if it is available to unsubscribe Redis channel
      await this.redisService.unsubscribeFromChannel(`chatroom:${chatroomId}`);

      // emit exit message
      client
        .to(chatroomId)
        .emit('chat', `${token.nickname}님이 퇴장하셨습니다.`);

      // leave room through Socket.io
      await client.leave(chatroomId);
    } catch (error) {
      client.emit('error', { message: 'error occurred leaving' });
    }
  }
}
