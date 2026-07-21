import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportingUseCase } from '../../application/use-cases';
import { JwtAuthGuard, RequirePermission, CurrentUser } from '../../../identity/interface';
import { CreateReportDto } from '../dto';
@ApiTags('Reporting') @Controller('reporting') @UseGuards(JwtAuthGuard) @ApiBearerAuth()
export class ReportingController {
  constructor(private readonly reportingUseCase: ReportingUseCase) {}
  @Get('funnel') @ApiOperation({ summary: 'Get funnel data' }) async getFunnel() { return this.reportingUseCase.getFunnelData(); }
  @Get('conversion/program') @ApiOperation({ summary: 'Get conversion by program' }) async getConversionByProgram() { return this.reportingUseCase.getConversionByProgram(); }
  @Get('conversion/source') @ApiOperation({ summary: 'Get conversion by source' }) async getConversionBySource() { return this.reportingUseCase.getConversionBySource(); }
  @Get('advisor-ranking') @ApiOperation({ summary: 'Get advisor ranking' }) async getAdvisorRanking() { return this.reportingUseCase.getAdvisorRanking(); }
  @Get('reports') @ApiOperation({ summary: 'List saved reports' }) async getReports() { return this.reportingUseCase.getAllReports(); }
  @Post('reports') @RequirePermission('reporting', 'manage') @ApiOperation({ summary: 'Save a report' }) async createReport(@Body() dto: CreateReportDto, @CurrentUser('sub') userId: string) { return this.reportingUseCase.createReport({ ...dto, createdBy: userId }); }
  @Delete('reports/:id') @RequirePermission('reporting', 'manage') @ApiOperation({ summary: 'Delete a report' }) async deleteReport(@Param('id') id: string) { await this.reportingUseCase.deleteReport(id); return { message: 'Report deleted' }; }
}
