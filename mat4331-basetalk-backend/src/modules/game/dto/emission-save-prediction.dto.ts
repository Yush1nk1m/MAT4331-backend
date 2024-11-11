import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class EmissionSavePredictionDto {
  @IsString()
  @IsNotEmpty()
  game_id: string;

  @IsInt()
  predicted_away_score: number;

  @IsInt()
  predicted_home_score: number;
}
