import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class ChatroomIdDto {
  @Type(() => Number)
  @IsInt({ message: "Chatroom's id must be integer" })
  @Min(1, { message: "Chatroom's id must be positive integer" })
  chatroomId: number;
}
