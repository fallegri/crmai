import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ActivityUseCase } from '../../application/use-cases';
import { JwtAuthGuard, CurrentUser } from '../../../identity/interface';
import { RecordActivityDto } from '../dto';

@ApiTags('Activities')
@Controller('activities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ActivityController {
  constructor(private readonly activityUseCase: ActivityUseCase) {}

  @Post()
  @ApiOperation({ summary: 'Record a new activity event' })
  async record(@Body() dto: RecordActivityDto, @CurrentUser('sub') actorId: string) {
    return this.activityUseCase.record({ ...dto, actorId });
  }

  @Get('contact/:contactId')
  @ApiOperation({ summary: 'Get activity timeline for a contact' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getContactTimeline(@Param('contactId') contactId: string, @Query('cursor') cursor?: string, @Query('limit') limit = 20) {
    return this.activityUseCase.getContactTimeline(contactId, cursor, +limit);
  }

  @Get('opportunity/:opportunityId')
  @ApiOperation({ summary: 'Get activity timeline for an opportunity' })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getOpportunityTimeline(@Param('opportunityId') opportunityId: string, @Query('cursor') cursor?: string, @Query('limit') limit = 20) {
    return this.activityUseCase.getOpportunityTimeline(opportunityId, cursor, +limit);
  }
}
