import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../game/game.entity';
import { Member } from '../member/member.entity';
import { KBOTeam } from '../common/types/KBO-team.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * each game's chat room's entity
 */
@Entity()
export class Chatroom {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "The chat room's identifier" })
  id: number;

  @ManyToOne(() => Game)
  @JoinColumn({ name: 'game_id' })
  @ApiProperty({ description: 'The game of the chat room' })
  game: Game;

  @ManyToOne(() => Member)
  @JoinColumn({ name: 'member_id' })
  @ApiProperty({ description: 'The creator of the chat room' })
  creator: Member;

  @Column({ length: 20 })
  @ApiProperty({ description: "The chat room's title" })
  title: string;

  @Column({
    type: 'enum',
    enum: KBOTeam,
    default: KBOTeam.NONE,
  })
  @ApiProperty({ description: "The chat room's prefered team" })
  preferTeam: KBOTeam;

  @Column()
  @ApiProperty({ description: 'The number of participant in the chat room' })
  participantCount: number;

  @CreateDateColumn()
  @ApiProperty({ description: "The chat room's created date" })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: "The chat room's updated date" })
  updatedAt: Date;
}
