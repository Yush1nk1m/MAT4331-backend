import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LocalLoginDto {
  @ApiProperty({ description: "Member's email" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Member's password" })
  @IsString()
  @IsNotEmpty()
  password: string;
}
