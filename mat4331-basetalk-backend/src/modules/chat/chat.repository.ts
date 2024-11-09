import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { Chatroom } from '../chatroom/chatroom.entity';
import { Member } from '../member/member.entity';

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
}
