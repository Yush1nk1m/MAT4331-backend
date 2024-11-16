import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class GameIdDto {
  @Type(() => Number)
  @IsInt({ message: "Game's id must be integer" })
  @Min(1, { message: "Game's id must be positive integer" })
  gameId: number;
}
