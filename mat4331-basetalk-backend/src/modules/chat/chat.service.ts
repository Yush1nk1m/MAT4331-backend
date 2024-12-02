import { ForbiddenException, Inject, Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SaveChatDto } from './dto/save-chat.dto';
import { Chat } from './chat.entity';
import { ChatroomService } from '../chatroom/chatroom.service';
import { ChatPaginationDto } from './dto/chat-pagination.dto';
import { Member } from '../member/member.entity';
import { MemberChatroomService } from '../member-chatroom/member-chatroom.service';
import { Chatroom } from '../chatroom/chatroom.entity';
import { ClientProxy } from '@nestjs/microservices';
import { PredictProfanityDto } from './dto/predict-profanity.dto';
import { Events } from '../../common/constants/event.constant';
import { Server } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { Transactional } from 'typeorm-transactional';
import { plainToInstance } from 'class-transformer';
import { ChatSavePredictionDto } from './dto/chat-save-prediction.dto';

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger(ChatService.name);

  private server: Server;
  setServer(server: Server) {
    this.server = server;
  }

  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatroomService: ChatroomService,
    private readonly memberChatroomService: MemberChatroomService,
    @Inject('MainToAi')
    private readonly rmqClient: ClientProxy,
  ) {}

  /**
   * method for save chat to the DB and return additional information
   * @param saveChatDto chat's writer, chatroom's id, content
   * @returns created chat
   */
  @Transactional()
  async saveChat(saveChatDto: SaveChatDto): Promise<void> {
    // destruct DTO
    const { member, chatroom, content } = saveChatDto;

    // create chat
    const chat: Chat = await this.chatRepository.createChat(
      chatroom,
      member,
      content,
    );

    // request AI service to predict profanity
    await this.requestProfanityPrediction(chat);

    // broadcast chat to the chatroom
    const chatDto: ChatDto = plainToInstance(ChatDto, chat, {
      excludeExtraneousValues: true,
    });
    await this.broadcastChatToChatroom(String(chatroom.id), chatDto);
  }

  /**
   * method for request AI service to predict profanity
   * @param chat Chat entity
   */
  async requestProfanityPrediction(chat: Chat): Promise<void> {
    // create DTO with Chat
    const predictProfanityDto: PredictProfanityDto = {
      chat_id: chat.id,
      content: chat.content,
    };

    this.logger.debug(
      `Emit event with PredictProfanityDTO: ${JSON.stringify(predictProfanityDto)}`,
    );

    // emit event to AI service
    this.rmqClient.emit(Events.CHAT_PREDICT_PROFANITY, predictProfanityDto);
  }

  @Transactional()
  async saveChatPrediction(
    chatSavePredictionDto: ChatSavePredictionDto,
  ): Promise<void> {
    // destruct DTO
    const { chat_id, is_profane } = chatSavePredictionDto;

    // find chat by its id
    const chat: Chat =
      await this.chatRepository.findChatAndChatroomById(chat_id);
    // find chat's chatroom
    const chatroom: Chatroom = chat.chatroom;

    await this.chatRepository.updateChatProfanity(chat_id, is_profane);

    this.logger.debug(`Received profanity: ${chat_id}: ${is_profane}`);

    if (is_profane) {
      await this.broadcastProfanityToChatroom(String(chatroom.id), chat.id);
      this.logger.debug(
        `broadcasted to chatroom: ${chatroom.id}, chat: ${chat.id}`,
      );
    }
  }

  /**
   * method for finding recent chats by pagination
   * @param chatPaginationDto chatroom's id, chat's id, load count
   * @returns found chats and metadata
   */
  async findChatsByPagination(
    member: Member,
    chatPaginationDto: ChatPaginationDto,
  ): Promise<Chat[]> {
    // destruct DTO
    const { chatroomId } = chatPaginationDto;

    // validate chatroom
    const chatroom: Chatroom =
      await this.chatroomService.validateChatroomById(chatroomId);

    // validate if member's joined the chatroom
    try {
      await this.memberChatroomService.validateMemberChatroomByMemberAndChatroom(
        member,
        chatroom,
      );
    } catch {
      throw new ForbiddenException('Member has not joined the chatroom');
    }

    return this.chatRepository.findChatsByPagination(chatPaginationDto);
  }

  /**
   * method for broadcasting chat to the chatroom
   * @param chatroomId chatroom's id
   * @param chatDto chat DTO
   */
  async broadcastChatToChatroom(
    chatroomId: string,
    chatDto: ChatDto,
  ): Promise<void> {
    this.server.to(chatroomId).emit('chat', chatDto);
  }

  /**
   * method for broadcasting chat's profanity to the chatroom
   * @param chatroomId chatroom's id
   * @param chatId chat's id
   */
  async broadcastProfanityToChatroom(
    chatroomId: string,
    chatId: number,
  ): Promise<void> {
    this.server.to(chatroomId).emit('profane', chatId);
  }
}
