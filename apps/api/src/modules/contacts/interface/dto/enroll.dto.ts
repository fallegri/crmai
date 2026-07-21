import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class EnrollDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  evidenceUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
