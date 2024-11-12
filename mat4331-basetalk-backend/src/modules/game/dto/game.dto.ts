import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { KBOTeam } from '../../../common/types/KBO-team.enum';
import { GameStatus } from '../../../common/types/game-status.enum';

export class GameDto {
  @ApiProperty({ description: "Game's id" })
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty({ description: "Game's crawling id" })
  @IsInt()
  @Expose()
  gameCid: number;

  @ApiProperty({ enum: KBOTeam, description: 'Away team' })
  @IsString()
  @IsEnum(KBOTeam)
  @Expose()
  awayTeam: KBOTeam;

  @ApiProperty({ enum: KBOTeam, description: 'Away team' })
  @IsString()
  @IsEnum(KBOTeam)
  @Expose()
  homeTeam: KBOTeam;

  @ApiProperty({ description: "Away team's real score" })
  @IsOptional()
  @IsInt()
  @Expose()
  awayScore?: number;

  @ApiProperty({ description: "Home team's real score" })
  @IsOptional()
  @IsInt()
  @Expose()
  homeScore?: number;

  @ApiProperty({ description: "Away team's AI predicted score" })
  @IsOptional()
  @IsInt()
  @Expose()
  predictedAwayScore?: number;

  @ApiProperty({ description: "Home team's AI predicted score" })
  @IsOptional()
  @IsInt()
  @Expose()
  predictedHomeScore?: number;

  @ApiProperty({
    enum: GameStatus,
    description:
      "Game's status indicating if it is canceled or finished or scheduled",
  })
  @IsEnum(GameStatus)
  @Expose()
  gameStatus: GameStatus;

  @ApiProperty({
    description: "Game's scheduled date",
  })
  @IsDate()
  @Expose()
  gamedate: Date;
}
