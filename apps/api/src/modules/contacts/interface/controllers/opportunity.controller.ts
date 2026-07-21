import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { OpportunityUseCase, PipelineUseCase, AssignmentUseCase, EnrollmentUseCase } from '../../application/use-cases';
import { JwtAuthGuard, RequirePermission, CurrentUser } from '../../../identity/interface';
import { CreateOpportunityDto, CreateStageDto, EnrollDto } from '../dto';

@ApiTags('Opportunities')
@Controller('opportunities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OpportunityController {
  constructor(
    private readonly opportunityUseCase: OpportunityUseCase,
    private readonly pipelineUseCase: PipelineUseCase,
    private readonly assignmentUseCase: AssignmentUseCase,
    private readonly enrollmentUseCase: EnrollmentUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new opportunity' })
  async create(@Body() dto: CreateOpportunityDto) {
    return this.opportunityUseCase.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List opportunities' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'stageId', required: false })
  @ApiQuery({ name: 'advisorId', required: false })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20, @Query('stageId') stageId?: string, @Query('advisorId') advisorId?: string) {
    return this.opportunityUseCase.findAll(+page, +limit, stageId, advisorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opportunity by ID' })
  async findById(@Param('id') id: string) {
    return this.opportunityUseCase.findById(id);
  }

  @Post(':id/move/:stageId')
  @ApiOperation({ summary: 'Move opportunity to a pipeline stage' })
  async moveToStage(@Param('id') id: string, @Param('stageId') stageId: string) {
    return this.opportunityUseCase.moveToStage(id, stageId);
  }

  @Post(':id/assign/:advisorId')
  @RequirePermission('contacts', 'assign')
  @ApiOperation({ summary: 'Assign an advisor to an opportunity' })
  async assignAdvisor(@Param('id') id: string, @Param('advisorId') advisorId: string) {
    await this.assignmentUseCase.manualAssign(id, advisorId);
    return { message: 'Advisor assigned' };
  }

  @Post(':id/auto-assign')
  @ApiOperation({ summary: 'Auto-assign an advisor (round-robin)' })
  async autoAssign(@Param('id') id: string, @Query('programId') programId: string) {
    await this.assignmentUseCase.autoAssign(id, programId);
    return { message: 'Auto-assignment completed' };
  }

  @Post(':id/enroll')
  @ApiOperation({ summary: 'Enroll an opportunity (manual enrollment)' })
  async enroll(@Param('id') id: string, @Body() dto: EnrollDto, @CurrentUser('sub') userId: string) {
    return this.enrollmentUseCase.enroll(id, userId, dto.evidenceUrl, dto.notes);
  }

  @Get(':id/enrollments')
  @ApiOperation({ summary: 'Get enrollment history' })
  async getEnrollments(@Param('id') id: string) {
    return this.enrollmentUseCase.getEnrollments(id);
  }

  @Post(':id/win')
  @ApiOperation({ summary: 'Mark opportunity as won' })
  async markAsWon(@Param('id') id: string) {
    return this.opportunityUseCase.markAsWon(id);
  }

  @Post(':id/lose')
  @ApiOperation({ summary: 'Mark opportunity as lost' })
  async markAsLost(@Param('id') id: string) {
    return this.opportunityUseCase.markAsLost(id);
  }
}
