import { IsNotEmpty, IsString } from 'class-validator';

export class GameCidDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;
}
