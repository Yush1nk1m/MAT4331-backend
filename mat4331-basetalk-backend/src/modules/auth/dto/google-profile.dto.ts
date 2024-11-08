import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleProfileDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Google OAuth2 email' })
  readonly email: string;

  @IsString()
  @ApiProperty({ description: 'Google OAuth2 first name' })
  readonly firstName: string;

  @IsString()
  @ApiProperty({ description: 'Google OAuth2 last name' })
  readonly lastName: string;

  @IsString()
  @ApiProperty({ description: 'Google OAuth2 profile image path' })
  readonly picture: string;
}
