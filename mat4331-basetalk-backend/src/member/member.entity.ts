import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { KBOTeam } from '../common/types/KBO-team.enum';
import { MemberType } from './types/member-type.enum';
import { AccountStatus } from './types/account-status.enum';
import { ApiProperty } from '@nestjs/swagger';

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

  @Column({ length: 20 })
  @ApiProperty({ description: 'The nickname of the member' })
  nickname: string;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: 'The bio message of the member' })
  bio: string = '';

  // prefer team
  @Column({
    type: 'enum',
    enum: KBOTeam,
    default: KBOTeam.NONE,
  })
  @ApiProperty({ description: "The member's prefer team" })
  preferTeam: KBOTeam;

  @Column({ length: 255, nullable: true })
  @ApiProperty({ description: "The profile image's link of the member" })
  profile: string;

  @Column({
    type: 'enum',
    enum: MemberType,
  })
  @ApiProperty({
    description:
      "The member's type indicating he or she is a guest member or a signed member",
  })
  type: MemberType;

  // member account's status: active or inactive
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
}
