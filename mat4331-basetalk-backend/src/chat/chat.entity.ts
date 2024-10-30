import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Chatroom } from '../chatroom/chatroom.entity';
import { Member } from '../member/member.entity';
import { ChatType } from './types/chat-type.type';
import { ChatStatus } from './types/chat-status.type';

/**
 * chat's entity
 */
@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "The chat's identifier" })
  id: number;

  @ManyToOne(() => Chatroom)
  @JoinColumn({ name: 'chatroom_id' })
  @ApiProperty({ description: 'The identifier of the chat room it belonged' })
  chatroom: Chatroom;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  @ApiProperty({ description: 'The identifier of the writer' })
  writer: Member;

  @Column({ length: 255 })
  @ApiProperty({ description: 'The content of the chat' })
  content: string;

  @Column({
    type: 'enum',
    enum: ChatType,
    default: ChatType.TEXT,
  })
  @ApiProperty({
    description: 'The type of the chat(text, image, video, etc.)',
  })
  type: ChatType;

  @Column({
    type: 'enum',
    enum: ChatStatus,
    default: ChatStatus.NONE,
  })
  @ApiProperty({
    description:
      "The chat's filtered status indicating it is predicted as bad chat or not",
  })
  status: ChatStatus;

  @Column({ nullable: true })
  @ApiProperty({ description: "The chat's filtered date" })
  filteredAt: Date;

  @CreateDateColumn()
  @ApiProperty({ description: "The chat's created date" })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: "The chat's updated date" })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: "The chat's deleted date" })
  deletedAt: Date;
}
