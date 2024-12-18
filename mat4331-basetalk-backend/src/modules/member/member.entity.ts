import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KBOTeam } from '../../common/types/KBO-team.enum';
import { MemberType } from '../../common/types/member-type.enum';
import { AccountStatus } from '../../common/types/account-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { MemberChatroom } from '../member-chatroom/member-chatroom.entity';
import { Chat } from '../chat/chat.entity';

/**
 * service member's entity
 */
@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The identifier of the member' })
  id: number;

  @Column({ unique: true, length: 64 })
  @ApiProperty({ description: 'The email of the member' })
  email: string;

  @Column({ length: 64, nullable: true })
  @ApiProperty({ description: 'The password of the member' })
  password?: string;

  @Column({ length: 20 })
  @ApiProperty({ description: 'The nickname of the member' })
  nickname: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: 'The bio message of the member' })
  bio?: string;

  @Column({
    type: 'enum',
    enum: KBOTeam,
    default: KBOTeam.NONE,
  })
  @ApiProperty({ description: "The member's prefer team" })
  preferTeam: KBOTeam;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: "The profile image's link of the member" })
  profile?: string;

  @Column({
    type: 'enum',
    enum: MemberType,
  })
  @ApiProperty({
    description: "The member's type indicating OAuth, local or guest",
  })
  type: MemberType;

  @Column({
    type: 'enum',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  @ApiProperty({
    description: 'The status of the account indicating active or inactive',
  })
  status: AccountStatus;

  @CreateDateColumn()
  @ApiProperty({ description: "The member's signed date" })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: "The member's recent update date" })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: "The account's deletion date" })
  deletedAt: Date;

  // Object relationships
  @OneToMany(() => MemberChatroom, (memberChatroom) => memberChatroom.member, {
    cascade: true,
    lazy: true,
  })
  @ApiProperty({ description: "Member's joined chatrooms information" })
  memberChatroomList: Promise<MemberChatroom[]>;

  @OneToMany(() => Chat, (chat) => chat.writer, {
    cascade: true,
    lazy: true,
  })
  @ApiProperty({ description: "Member's written chats" })
  chatList: Promise<Chat[]>;
}
