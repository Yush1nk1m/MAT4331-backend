import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { GameStatus } from '../../../common/types/game-status.enum';
import { KBOTeam } from 'src/common/types/KBO-team.enum';

export class EmissionGameUpdatedDto {
  @IsString()
  gameCid: string;

  @IsString()
  @IsEnum(KBOTeam)
  awayTeam: KBOTeam;

  @IsEnum(KBOTeam)
  homeTeam: KBOTeam;

  @IsOptional()
  @IsInt()
  awayScore?: number;

  @IsOptional()
  @IsInt()
  homeScore?: number;

  @IsEnum(GameStatus)
  gameStatus: GameStatus;

  @IsDate()
  gameDate: Date;
}
