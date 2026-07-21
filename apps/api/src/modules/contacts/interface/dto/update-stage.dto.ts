import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  position?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isTerminal?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;
}
