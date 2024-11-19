import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Member } from '../member/member.entity';
import { SaveChatDto } from './dto/save-chat.dto';
import { JwtService } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';
import { JwtPayload } from '../../common/types/jwt-payload.type';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { jwtAccessOptions } from '../../config/jwt.config';
import { ChatDto } from './dto/chat.dto';
import { ChatroomService } from '../chatroom/chatroom.service';
import { Chatroom } from '../chatroom/chatroom.entity';
import { plainToInstance } from 'class-transformer';
import * as dotenv from 'dotenv';
import { SendChatDto } from './dto/send-chat.dto';
dotenv.config();

@ApiTags('Chat')
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: [
      'http://localhost:3000',
      'https://www.basetalk.org',
      'https://basetalk.org',
    ],
    credentials: true,
  },
})
export class ChatGateway {
  private logger: Logger = new Logger(ChatGateway.name);

  constructor(
    private readonly chatService: ChatService,
    private readonly memberService: MemberService,
    private readonly chatroomService: ChatroomService,
    private readonly jwtService: JwtService,
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

    // validate token
    try {
      // decode JWT token
      const decoded: JwtPayload = await this.jwtService.verifyAsync<JwtPayload>(
        token,
        jwtAccessOptions,
      );

      // verify if member exists
      const member: Member = await this.memberService.findMemberById(
        decoded.sub,
      );
      if (!member) {
        throw new Error();
      }

      // return found member
      return member;
    } catch (error) {
      throw new Error(`Failed to verify access token: ${error.message}`);
    }
  }

  @ApiOperation({
    summary: '[WS-03] 채팅 전송',
    description: '특정 채팅방에 채팅을 전송한다.',
  })
  @SubscribeMessage('chat')
  async handleChat(
    @MessageBody() sendChatDto: SendChatDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      // destruct DTO
      const { chatroomId, content } = sendChatDto;

      // validate client token
      const member: Member = await this.validateClientToken(client);
      this.logger.debug(`Chat writer: ${JSON.stringify(member)}`);

      // validate chatroom
      const chatroom: Chatroom =
        await this.chatroomService.validateChatroomById(chatroomId);

      // create DTO to save chat
      const SaveChatDto: SaveChatDto = {
        member,
        chatroom,
        content: content,
      };

      // create chat and convert it to DTO
      const chat: Chat = await this.chatService.saveChat(SaveChatDto);
      const chatDto: ChatDto = plainToInstance(ChatDto, chat, {
        excludeExtraneousValues: true,
      });

      this.logger.debug(`saved chat: ${JSON.stringify(chatDto)}`);

      client.to(String(chatroomId)).emit('chat', chatDto);
      client.emit('chat', chatDto);
    } catch (error) {
      client.emit('error', {
        message: `Error occurred while sending chat: ${error.message}`,
      });
    }
  }
}
