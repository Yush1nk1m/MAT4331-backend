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
    // find if there's already MemberChatroom information and early return if it exists
    let memberChatroom: MemberChatroom =
      await this.memberChatroomRepository.findMemberChatroomByMemberAndChatroom(
        member,
        chatroom,
      );

    this.logger.debug(
      `found MemberChatroom: ${JSON.stringify(memberChatroom)}`,
    );

    if (memberChatroom) {
      this.logger.debug(
        `Member has already joined the chatroom with id: ${chatroom.id}`,
      );
      return memberChatroom;
    }

    // create MemberChatroom information
    memberChatroom = await this.memberChatroomRepository.createMemberChatroom(
      member,
      chatroom,
    );

    this.logger.debug(`created MemberChatroom id: ${memberChatroom.id}`);

    return memberChatroom;
  }

  /**
   * method for leaving member from chatroom
   * @param member Member instance
   * @param chatroom Chatroom instance
   */
  async leaveMemberFromChatroom(
    member: Member,
    chatroom: Chatroom,
  ): Promise<void> {
    // delete MemberChatroom
    await this.memberChatroomRepository.deleteMemberChatroom(member, chatroom);
  }

  /**
   * method for finding member's joined chatrooms' information list
   * @param member Member instance
   * @returns found MemberChatrooms' list
   */
  async findMemberChatroomsByMember(member: Member): Promise<MemberChatroom[]> {
    return this.memberChatroomRepository.findMemberChatroomsByMember(member);
  }

  /**
   * method for finding member's participation information to the specified chatroom
   * @param member Member instance
   * @param chatroom Chatroom instance
   * @returns found MemberChatroom
   */
  async findMemberChatroomByMemberAndChatroom(
    member: Member,
    chatroom: Chatroom,
  ): Promise<MemberChatroom> {
    return this.memberChatroomRepository.findMemberChatroomByMemberAndChatroom(
      member,
      chatroom,
    );
  }
}
