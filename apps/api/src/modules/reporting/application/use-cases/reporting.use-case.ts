import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { REPORT_REPOSITORY_PORT, ReportRepositoryPort } from '../ports';
import { DashboardReport, FunnelData, ConversionData, AdvisorRanking } from '../../domain';
@Injectable()
export class ReportingUseCase {
  constructor(@Inject(REPORT_REPOSITORY_PORT) private readonly repo: ReportRepositoryPort) {}
  async createReport(data: { name: string; description?: string; type?: string; config?: any; createdBy: string }): Promise<DashboardReport> { return this.repo.create(data); }
  async getAllReports(): Promise<DashboardReport[]> { return this.repo.findAll(); }
  async deleteReport(id: string): Promise<void> { const r = await this.repo.findById(id); if (!r) throw new NotFoundException('Report not found'); await this.repo.delete(id); }
  async getFunnelData(): Promise<FunnelData[]> { return this.repo.getFunnelData(); }
  async getConversionByProgram(): Promise<ConversionData[]> { return this.repo.getConversionByProgram(); }
  async getConversionBySource(): Promise<ConversionData[]> { return this.repo.getConversionBySource(); }
  async getAdvisorRanking(): Promise<AdvisorRanking[]> { return this.repo.getAdvisorRanking(); }
}
