import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PredictProfanityDto {
  @IsInt()
  chat_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
