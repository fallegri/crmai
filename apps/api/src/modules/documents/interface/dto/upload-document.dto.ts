import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class UploadDocumentDto { @ApiProperty() @IsString() name: string; @ApiPropertyOptional() @IsOptional() @IsString() description?: string; @ApiProperty() @IsString() fileUrl: string; @ApiProperty() @IsString() fileType: string; @ApiPropertyOptional() @IsOptional() @IsNumber() fileSize?: number; @ApiPropertyOptional() @IsOptional() @IsString() contactId?: string; @ApiPropertyOptional() @IsOptional() @IsString() opportunityId?: string; }
