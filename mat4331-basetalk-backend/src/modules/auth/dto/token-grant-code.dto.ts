import { IsNotEmpty, IsString } from 'class-validator';

export class TokenGrantCode {
  @IsString()
  @IsNotEmpty()
  code: string;
}
