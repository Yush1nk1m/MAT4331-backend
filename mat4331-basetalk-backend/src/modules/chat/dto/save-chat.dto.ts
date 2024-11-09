import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Member } from '../../member/member.entity';
import { Chatroom } from '../../chatroom/chatroom.entity';

export class SaveChatDto {
  @ApiProperty({ description: "Chat's writer" })
  member: Member;

  @ApiProperty({ description: "Chat's chatroom" })
  chatroom: Chatroom;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Chat content' })
  content: string;
}
