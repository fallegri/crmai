import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CampaignUseCase } from '../../application/use-cases';
import { JwtAuthGuard, RequirePermission, CurrentUser } from '../../../identity/interface';
import { CreateCampaignDto } from '../dto';
@ApiTags('Campaigns') @Controller('campaigns') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
export class CampaignController {
  constructor(private readonly campaignUseCase: CampaignUseCase) {}
  @Post() @RequirePermission('campaigns', 'manage') @ApiOperation({ summary: 'Create campaign' })
  async create(@Body() dto: CreateCampaignDto, @CurrentUser('sub') createdBy: string) {
    return this.campaignUseCase.create({ ...dto, createdBy, startDate: dto.startDate ? new Date(dto.startDate) : undefined, endDate: dto.endDate ? new Date(dto.endDate) : undefined });
  }
  @Get() @ApiOperation({ summary: 'List campaigns' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) { return this.campaignUseCase.findAll(+page, +limit); }
  @Get(':id') @ApiOperation({ summary: 'Get campaign by ID' })
  async findById(@Param('id') id: string) { return this.campaignUseCase.findById(id); }
  @Put(':id') @RequirePermission('campaigns', 'manage') @ApiOperation({ summary: 'Update campaign' })
  async update(@Param('id') id: string, @Body() dto: CreateCampaignDto) { return this.campaignUseCase.update(id, dto); }
  @Delete(':id') @RequirePermission('campaigns', 'manage') @ApiOperation({ summary: 'Delete campaign' })
  async delete(@Param('id') id: string) { await this.campaignUseCase.delete(id); return { message: 'Campaign deleted' }; }
}
