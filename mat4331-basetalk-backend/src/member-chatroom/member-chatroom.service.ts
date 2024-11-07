import { Injectable, Logger } from '@nestjs/common';
import { MemberChatroomRepository } from './member-chatroom.repository';
import { Member } from '../member/member.entity';
import { Chatroom } from '../chatroom/chatroom.entity';
import { MemberChatroom } from './member-chatroom.entity';

@Injectable()
export class MemberChatroomService {
  private readonly logger = new Logger(MemberChatroomService.name);

  constructor(
    private readonly memberChatroomRepository: MemberChatroomRepository,
  ) {}

  /**
   * method for participating the member to the chatroom
   * @param member Member instance
   * @param chatroom Chatroom instance
   * @returns created MemberChatroom instance
   */
  async joinMemberToChatroom(
    member: Member,
    chatroom: Chatroom,
  ): Promise<MemberChatroom> {
    const memberChatroom: MemberChatroom =
      await this.memberChatroomRepository.createMemberChatroom(
        member,
        chatroom,
      );

    this.logger.debug(`created MemberChatroom id: ${memberChatroom.id}`);

    return memberChatroom;
  }
}
