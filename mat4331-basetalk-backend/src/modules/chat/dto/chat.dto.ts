import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Writer's nickname" })
  writer: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: "Chat's content" })
  content: string;

  @IsDate()
  @ApiProperty({ description: "Chat's created date" })
  createdAt: Date;
}
