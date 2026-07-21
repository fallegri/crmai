import { IsString, IsOptional, IsObject, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateRuleDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsString() triggerType: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() triggerConfig?: Record<string, any>;
  @ApiProperty() @IsString() actionType: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() actionConfig?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() priority?: number;
}
