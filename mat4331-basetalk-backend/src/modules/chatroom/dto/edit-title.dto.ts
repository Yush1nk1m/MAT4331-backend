import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditTitleDto {
  @ApiProperty({ description: "chatroom's new title" })
  @IsString()
  @IsNotEmpty()
  title: string;
}
