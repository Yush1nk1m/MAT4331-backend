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

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger(ChatService.name);

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
  async saveChat(saveChatDto: SaveChatDto): Promise<Chat> {
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

    return chat;
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
}
