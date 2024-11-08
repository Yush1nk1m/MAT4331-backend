import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberChatroom } from './member-chatroom.entity';
import { Repository } from 'typeorm';
import { Member } from '../member/member.entity';
import { Chatroom } from '../chatroom/chatroom.entity';

@Injectable()
export class MemberChatroomRepository {
  private readonly logger = new Logger(MemberChatroomRepository.name);

  constructor(
    @InjectRepository(MemberChatroom)
    private readonly repository: Repository<MemberChatroom>,
  ) {}

  /**
   * method for creating MemberChatroom instance
   * @param member Member instance
   * @param chatroom Chatroom instance
   * @returns created MemberChatroom instance
   */
  async createMemberChatroom(
    member: Member,
    chatroom: Chatroom,
  ): Promise<MemberChatroom> {
    // create MemberChatroom instance
    const memberChatroom: MemberChatroom = this.repository.create({
      member,
      chatroom,
    });

    // save and return it
    return this.repository.save(memberChatroom);
  }

  /**
   * method for deleting MemberChatroom
   * @param member Member instance
   * @param chatroom Chatroom instance
   */
  async deleteMemberChatroom(
    member: Member,
    chatroom: Chatroom,
  ): Promise<void> {
    await this.repository.delete({ member, chatroom });
  }

  /**
   * method for finding MemberChatrooms' list with the same member
   * @param member Member instance
   * @returns found MemberChatrooms
   */
  async findMemberChatroomsByMember(member: Member): Promise<MemberChatroom[]> {
    return this.repository.find({
      where: { member: { id: member.id } },
      relations: ['chatroom'],
    });
  }

  /**
   * method for finding a single row of MemberChatroom by member and chatroom
   * @param member Member instance
   * @param chatroom Chatroom instance
   * @returns found MemberChatroom
   */
  async findMemberChatroomByMemberAndChatroom(
    member: Member,
    chatroom: Chatroom,
  ): Promise<MemberChatroom> {
    return this.repository.findOneBy({
      member,
      chatroom,
    });
  }
}
