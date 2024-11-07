import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chatroom } from '../chatroom/chatroom.entity';
import { Member } from '../member/member.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * many-to-many mapping table for member and chat room
 */
@Entity()
export class MemberChatroom {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "The member-chatroom's identifier" })
  id: number;

  @ManyToOne(() => Chatroom)
  @ApiProperty({ description: "The chat room's identifier" })
  chatroom: Chatroom;

  @ManyToOne(() => Member)
  @ApiProperty({ description: "The member's identifier" })
  member: Member;

  @CreateDateColumn()
  @ApiProperty({ description: "The member's joined date" })
  createdAt: Date;
}
