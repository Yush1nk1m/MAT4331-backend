import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { Chatroom } from '../chatroom/chatroom.entity';
import { Member } from '../member/member.entity';
import { ChatPaginationDto } from './dto/chat-pagination.dto';
import { ChatStatus } from '../../common/types/chat-status.enum';

@Injectable()
export class ChatRepository {
  private readonly logger: Logger = new Logger(ChatRepository.name);

  constructor(
    @InjectRepository(Chat)
    private readonly repository: Repository<Chat>,
  ) {}

  /**
   * method for creating chat
   * @param chatroom chat's chatroom
   * @param writer chat's writer
   * @param content chat's content
   * @returns created chat
   */
  async createChat(
    chatroom: Chatroom,
    writer: Member,
    content: string,
  ): Promise<Chat> {
    const chat: Chat = this.repository.create({
      chatroom,
      writer,
      content,
    });

    return this.repository.save(chat);
  }

  /**
   * method for finding chat by its id
   * @param id chat's id
   * @returns found Chat
   */
  async findChatAndChatroomById(id: number): Promise<Chat> {
    return this.repository.findOne({
      where: { id },
      relations: { chatroom: true },
    });
  }

  /**
   * method for finding chats by pagination
   * @param chatPaginationDto chatroom's id, chat's id, load count
   * @returns found Chats
   */
  async findChatsByPagination(
    chatPaginationDto: ChatPaginationDto,
  ): Promise<Chat[]> {
    const { chatroomId, chatId, loadCount } = chatPaginationDto;

    const qb = this.repository
      .createQueryBuilder('chat')
      .leftJoinAndSelect('chat.writer', 'member')
      .where('chat.chatroom_id = :chatroomId', { chatroomId })
      .andWhere('chat.status IN (:...statuses)', {
        statuses: [ChatStatus.NONE, ChatStatus.ACCEPT],
      })
      .andWhere('chat.deleted_at IS NULL')
      .orderBy('chat.id', 'DESC');

    if (chatId) {
      qb.andWhere('chat.id < :chatId', { chatId });
    }

    qb.limit(loadCount);

    const result = await qb.getMany();

    this.logger.debug(`found chat pagination: ${JSON.stringify(result)}`);

    return result;
  }

  /**
   * method for update chat's profanity
   * @param id chat's id
   * @param profanity chat's profanity
   */
  async updateChatProfanity(id: number, profanity: boolean): Promise<void> {
    await this.repository.update(id, {
      status: profanity === true ? ChatStatus.FILTERED : ChatStatus.FILTERED,
      filteredAt: new Date(),
    });
  }
}
