import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateReportDto { @ApiProperty() @IsString() name: string; @ApiPropertyOptional() @IsOptional() @IsString() description?: string; @ApiPropertyOptional() @IsOptional() @IsString() type?: string; @ApiPropertyOptional() @IsOptional() @IsObject() config?: Record<string, any>; }
