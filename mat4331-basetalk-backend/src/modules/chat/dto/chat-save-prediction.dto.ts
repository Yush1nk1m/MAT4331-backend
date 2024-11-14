import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt } from 'class-validator';

export class ChatSavePredictionDto {
  @ApiProperty({ description: "Chat's id" })
  @IsInt()
  chat_id: number;

  @ApiProperty({ description: "Chat's prediction result" })
  @IsBoolean()
  is_profane: boolean;
}
