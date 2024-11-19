import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { KBOTeam } from '../../../common/types/KBO-team.enum';
import { GameStatus } from '../../../common/types/game-status.enum';

export class CreateGameDto {
  @ApiProperty({ description: "Game's Crawling id" })
  @IsString()
  @IsNotEmpty()
  gameCid: string;

  @ApiProperty({ description: 'Home team', enum: KBOTeam })
  @IsEnum(KBOTeam)
  homeTeam: KBOTeam;

  @ApiProperty({ description: 'Away team', enum: KBOTeam })
  @IsEnum(KBOTeam)
  awayTeam: KBOTeam;

  @ApiProperty({ description: "Home team's score" })
  @IsInt()
  @IsOptional()
  homeScore?: number;

  @ApiProperty({ description: "Away team's score" })
  @IsInt()
  @IsOptional()
  awayScore?: number;

  @ApiProperty({ description: "Home team's predicted score" })
  @IsInt()
  @IsOptional()
  predictedHomeScore?: number;

  @ApiProperty({ description: "Away team's predicted score" })
  @IsInt()
  @IsOptional()
  predictedAwayScore?: number;

  @ApiProperty({ description: "Game's status", enum: GameStatus })
  @IsEnum(GameStatus)
  gameStatus: GameStatus;

  @ApiProperty({
    description: "Game's scheduled date",
    example: '2024-11-19',
  })
  @IsDateString()
  gameDate: string;
}
