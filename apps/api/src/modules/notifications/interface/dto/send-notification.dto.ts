import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class SendNotificationDto { @ApiProperty() @IsString() userId: string; @ApiProperty() @IsString() type: string; @ApiProperty() @IsString() title: string; @ApiPropertyOptional() @IsOptional() @IsString() body?: string; @ApiPropertyOptional() @IsOptional() @IsString() channel?: string; @ApiPropertyOptional() @IsOptional() @IsObject() metadata?: Record<string, any>; }
