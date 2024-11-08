import { IsEnum, IsInt, IsNotEmpty, IsString, Length } from 'class-validator';
import { KBOTeam } from '../../../common/types/KBO-team.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatroomDto {
  @ApiProperty({ description: "Game's id(not the crawling id)" })
  @IsInt()
  gameId: number;

  @ApiProperty({ description: "Chatroom's title" })
  @IsString()
  @Length(1, 20)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: "Chatroom's prefer KBO team",
    enum: KBOTeam,
  })
  @IsEnum(KBOTeam)
  @IsNotEmpty()
  preferTeam: KBOTeam;
}
