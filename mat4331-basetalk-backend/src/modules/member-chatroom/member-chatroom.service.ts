import { ConflictException, Injectable, Logger } from '@nestjs/common';
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
    // if the capacity has reached, throw Conflict exception
    if (chatroom.participantCount >= 20) {
      throw new ConflictException("Chatroom's capacity has reached");
    }

    // create MemberChatroom information
    const memberChatroom: MemberChatroom =
      await this.memberChatroomRepository.createMemberChatroom(
        member,
        chatroom,
      );

    // increment chatroom's participation count
    chatroom.participantCount++;

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

    // decrement chatroom's participant count
    chatroom.participantCount--;
  }

  /**
   * method for finding member's joined chatrooms' information list
   * @param member Member instance
   * @returns found MemberChatrooms' list
   */
  async findMemberChatroomsByMember(member: Member): Promise<MemberChatroom[]> {
    return this.memberChatroomRepository.findMemberChatroomsByMember(member);
  }
}
