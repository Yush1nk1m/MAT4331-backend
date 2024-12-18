import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsString, Length } from 'class-validator';
import { KBOTeam } from '../../../common/types/KBO-team.enum';

export class ChatroomDto {
  @ApiProperty({ description: "Chatroom's id" })
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty({ description: "Chatroom's title" })
  @IsString()
  @Length(1, 20)
  @Expose()
  title: string;

  @ApiProperty({ description: "Chatroom's prefer KBO team" })
  @IsEnum(KBOTeam)
  @Expose()
  preferTeam: KBOTeam;

  @ApiProperty({ description: "Chatroom's participant count" })
  @IsInt()
  @Expose()
  participantCount: number;

  @ApiProperty({ description: "Chatroom's created date" })
  @IsDate()
  @Expose()
  createdAt: Date;
}
