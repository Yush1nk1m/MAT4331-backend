import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ChatType } from '../../../common/types/chat-type.enum';
import { KBOTeam } from '../../../common/types/KBO-team.enum';

class WriterDto {
  @ApiProperty({ description: "Writer's id" })
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty({ description: "Writer's nickname" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  nickname: string;

  @ApiProperty({ enum: KBOTeam, description: "Writer's prefer team" })
  @IsEnum(KBOTeam)
  @Expose()
  preferTeam: KBOTeam;

  @ApiProperty({ description: "Writher's profile" })
  @IsOptional()
  @IsString()
  profile: string;
}

export class ChatDto {
  @ApiProperty({ description: "Chat's id" })
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty({ description: "Chat's content" })
  @IsString()
  @IsNotEmpty()
  @Expose()
  content: string;

  @ApiProperty({ description: "Chat's  type" })
  @IsEnum(ChatType)
  @Expose()
  type: ChatType;

  @ApiProperty({ description: "Chat's written date" })
  @IsDate()
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: WriterDto, description: "Chat's writer" })
  @Type(() => WriterDto)
  @Expose()
  writer: WriterDto;
}
