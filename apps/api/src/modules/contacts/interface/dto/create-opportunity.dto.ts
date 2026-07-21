import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOpportunityDto {
  @ApiProperty()
  @IsString()
  contactId: string;

  @ApiProperty()
  @IsString()
  programId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cohortId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
