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
}
