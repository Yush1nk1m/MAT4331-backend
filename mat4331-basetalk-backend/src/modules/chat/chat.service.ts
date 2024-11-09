import { Injectable, Logger } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SaveChatDto } from './dto/save-chat.dto';
import { Chat } from './chat.entity';
import { ChatroomService } from '../chatroom/chatroom.service';

@Injectable()
export class ChatService {
  private readonly logger: Logger = new Logger(ChatService.name);

  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatroomService: ChatroomService,
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
    const chat = await this.chatRepository.createChat(
      chatroom,
      member,
      content,
    );

    return chat;
  }
}
