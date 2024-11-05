import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { KBOTeam } from '../../common/types/KBO-team.enum';

export class SignUpDto {
  @ApiProperty({ description: "Member's email" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Member's password" })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: "Member's nickname" })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({ description: "Member's prefer team", enum: KBOTeam })
  @IsEnum(KBOTeam)
  preferTeam: KBOTeam;
}
