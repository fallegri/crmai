import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AutomationUseCase } from '../../application/use-cases';
import { JwtAuthGuard, RequirePermission } from '../../../identity/interface';
import { CreateRuleDto } from '../dto';
@ApiTags('Automations') @Controller('automations') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
export class AutomationController {
  constructor(private readonly automationUseCase: AutomationUseCase) {}
  @Post() @RequirePermission('automations', 'manage') @ApiOperation({ summary: 'Create automation rule' })
  async create(@Body() dto: CreateRuleDto) { return this.automationUseCase.create(dto); }
  @Get() @ApiOperation({ summary: 'List active automation rules' })
  async findAll() { return this.automationUseCase.findAllActive(); }
  @Get(':id') @ApiOperation({ summary: 'Get rule by ID' })
  async findById(@Param('id') id: string) { return this.automationUseCase.findById(id); }
  @Put(':id') @RequirePermission('automations', 'manage') @ApiOperation({ summary: 'Update rule' })
  async update(@Param('id') id: string, @Body() dto: CreateRuleDto) { return this.automationUseCase.update(id, dto); }
  @Delete(':id') @RequirePermission('automations', 'manage') @ApiOperation({ summary: 'Delete rule' })
  async delete(@Param('id') id: string) { await this.automationUseCase.delete(id); return { message: 'Rule deleted' }; }
}
