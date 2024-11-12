import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class SearchGameDto {
  @ApiProperty({ description: 'Year of date' })
  @Type(() => Number)
  @IsInt()
  year: number;

  @ApiProperty({ description: 'Month of date' })
  @Type(() => Number)
  @IsInt()
  month: number;

  @ApiProperty({ description: 'Day of date' })
  @Type(() => Number)
  @IsInt()
  day: number;
}
