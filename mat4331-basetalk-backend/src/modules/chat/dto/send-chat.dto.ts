import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class SendChatDto {
  @Type(() => Number)
  @IsInt()
  chatroomId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
