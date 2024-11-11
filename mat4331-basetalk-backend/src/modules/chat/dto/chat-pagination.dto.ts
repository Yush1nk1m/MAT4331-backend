import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class ChatPaginationDto {
  @ApiProperty({ description: "Chatroom's id" })
  @Type(() => Number)
  @IsInt()
  chatroomId: number;

  @ApiProperty({
    description: "Chat's id(the most recent chat if it is null)",
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  chatId?: number;

  @ApiProperty({ description: 'The number of chats to load' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  loadCount: number;
}
