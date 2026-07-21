import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PipelineUseCase } from '../../application/use-cases';
import { JwtAuthGuard, RequirePermission } from '../../../identity/interface';
import { CreateStageDto } from '../dto';

@ApiTags('Pipeline')
@Controller('pipeline')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PipelineController {
  constructor(private readonly pipelineUseCase: PipelineUseCase) {}

  @Get('stages')
  @ApiOperation({ summary: 'Get all pipeline stages' })
  async getAllStages() {
    return this.pipelineUseCase.getAllStages();
  }

  @Post('stages')
  @RequirePermission('contacts', 'manage-pipeline')
  @ApiOperation({ summary: 'Create a pipeline stage' })
  async createStage(@Body() dto: CreateStageDto) {
    return this.pipelineUseCase.createStage(dto);
  }

  @Put('stages/:id')
  @RequirePermission('contacts', 'manage-pipeline')
  @ApiOperation({ summary: 'Update a pipeline stage' })
  async updateStage(@Param('id') id: string, @Body() dto: CreateStageDto) {
    return this.pipelineUseCase.updateStage(id, dto);
  }

  @Delete('stages/:id')
  @RequirePermission('contacts', 'manage-pipeline')
  @ApiOperation({ summary: 'Delete a pipeline stage' })
  async deleteStage(@Param('id') id: string) {
    await this.pipelineUseCase.deleteStage(id);
    return { message: 'Stage deleted' };
  }
}
