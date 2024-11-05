import { IsEnum, IsInt, IsString } from 'class-validator';
import { KBOTeam } from '../../common/types/KBO-team.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SignedMemberDto {
  @ApiProperty({ description: "member's id" })
  @IsInt()
  @Expose()
  id: number;

  @ApiProperty({ description: "member's email" })
  @IsString()
  @Expose()
  email: string;

  @ApiProperty({ description: "member's nickname" })
  @IsString()
  @Expose()
  nickname: string;

  @ApiProperty({ description: "member's prefer team" })
  @IsEnum(KBOTeam)
  @Expose()
  preferTeam: KBOTeam;
}
