import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokensDto {
  @ApiProperty({ description: 'JWT access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ description: 'JWT refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
