import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStageDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  position: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isTerminal?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;
}
