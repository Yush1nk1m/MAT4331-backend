import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyGrantCodeDto {
  @ApiProperty({ description: 'OAuth grant code for issuing JWT tokens' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
