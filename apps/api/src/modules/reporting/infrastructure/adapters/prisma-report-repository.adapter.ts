import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ReportRepositoryPort } from '../../application/ports';
import { DashboardReport, FunnelData, ConversionData, AdvisorRanking } from '../../domain';
@Injectable()
export class PrismaReportRepositoryAdapter implements ReportRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any): Promise<DashboardReport> { const r = await this.prisma.dashboardReport.create({ data }); return this.toDomain(r); }
  async findAll(): Promise<DashboardReport[]> { const reports = await this.prisma.dashboardReport.findMany({ orderBy: { createdAt: 'desc' } }); return reports.map(r => this.toDomain(r)); }
  async findById(id: string): Promise<DashboardReport | null> { const r = await this.prisma.dashboardReport.findUnique({ where: { id } }); return r ? this.toDomain(r) : null; }
  async delete(id: string): Promise<void> { await this.prisma.dashboardReport.delete({ where: { id } }); }
  async getFunnelData(): Promise<FunnelData[]> {
    const stages = await this.prisma.pipelineStage.findMany({ orderBy: { position: 'asc' } });
    const total = await this.prisma.opportunity.count();
    const result: FunnelData[] = [];
    for (const stage of stages) {
      const count = await this.prisma.opportunity.count({ where: { currentStageId: stage.id } });
      result.push({ stage: stage.name, count, percentage: total > 0 ? Math.round((count / total) * 100) : 0 });
    }
    return result;
  }
  async getConversionByProgram(): Promise<ConversionData[]> {
    const programs = await this.prisma.program.findMany({ take: 20 });
    const result: ConversionData[] = [];
    for (const p of programs) {
      const total = await this.prisma.opportunity.count({ where: { programId: p.id } });
      const converted = await this.prisma.opportunity.count({ where: { programId: p.id, status: 'WON' as any } });
      result.push({ dimension: 'program', value: p.name, total, converted, conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0 });
    }
    return result;
  }
  async getConversionBySource(): Promise<ConversionData[]> {
    const sources = await this.prisma.opportunity.groupBy({ by: ['source'], _count: { id: true }, where: { source: { not: null } } });
    const result: ConversionData[] = [];
    for (const s of sources) {
      const total = s._count.id;
      const converted = await this.prisma.opportunity.count({ where: { source: s.source, status: 'WON' as any } });
      result.push({ dimension: 'source', value: s.source || 'unknown', total, converted, conversionRate: total > 0 ? Math.round((converted / total) * 100) : 0 });
    }
    return result;
  }
  async getAdvisorRanking(): Promise<AdvisorRanking[]> {
    const users = await this.prisma.user.findMany({ take: 50 });
    const result: AdvisorRanking[] = [];
    for (const u of users) {
      const total = await this.prisma.opportunity.count({ where: { assignedAdvisorId: u.id } });
      const won = await this.prisma.opportunity.count({ where: { assignedAdvisorId: u.id, status: 'WON' as any } });
      result.push({ advisorId: u.id, advisorName: `${u.firstName} ${u.lastName}`, opportunitiesCount: total, wonCount: won, conversionRate: total > 0 ? Math.round((won / total) * 100) : 0 });
    }
    return result.sort((a, b) => b.conversionRate - a.conversionRate);
  }
  private toDomain(r: any): DashboardReport { return new DashboardReport(r.id, r.name, r.description, r.type, r.config, r.createdBy, r.createdAt, r.updatedAt); }
}
