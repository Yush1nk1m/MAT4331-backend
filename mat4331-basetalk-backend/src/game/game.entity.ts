import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { KBOTeam } from '../common/types/KBO-team.enum';
import { GameStatus } from './types/game-status.enum';
import { ApiProperty } from '@nestjs/swagger';

/**
 * KBO game's entity
 */
@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: "The KBO game's identifier" })
  id: number;

  @Column({ length: 16 })
  @ApiProperty({ description: 'The identifier for web scraping' })
  gameCid: string;

  @Column({
    type: 'enum',
    enum: KBOTeam,
  })
  @ApiProperty({ description: 'Home team of the game' })
  homeTeam: KBOTeam;

  @Column({
    type: 'enum',
    enum: KBOTeam,
  })
  @ApiProperty({ description: 'Away team of the game' })
  awayTeam: KBOTeam;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The result score of home team' })
  homeScore?: number;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The result score of away team' })
  awayScore?: number;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The model predicted score of home team' })
  predictedHomeScore?: number;

  @Column({ nullable: true })
  @ApiProperty({ description: 'The model predicted score of away team' })
  predictedAwayScore?: number;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.SCHEDULED,
  })
  @ApiProperty({
    description: "The game's status indicating if it is canceled or confirmed",
  })
  gameStatus: string;

  @Column()
  @ApiProperty({
    description: "The game's running date",
  })
  gameDate: Date;
}
