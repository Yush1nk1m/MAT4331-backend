import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccessTokenDto {
  @ApiProperty({ description: 'Refreshed access token' })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
