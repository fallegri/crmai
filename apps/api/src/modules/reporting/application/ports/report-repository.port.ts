import { DashboardReport, FunnelData, ConversionData, AdvisorRanking } from '../../domain';
export const REPORT_REPOSITORY_PORT = 'ReportRepositoryPort';
export interface ReportRepositoryPort {
  create(data: { name: string; description?: string; type?: string; config?: any; createdBy: string }): Promise<DashboardReport>;
  findAll(): Promise<DashboardReport[]>;
  findById(id: string): Promise<DashboardReport | null>;
  delete(id: string): Promise<void>;
  getFunnelData(): Promise<FunnelData[]>;
  getConversionByProgram(): Promise<ConversionData[]>;
  getConversionBySource(): Promise<ConversionData[]>;
  getAdvisorRanking(): Promise<AdvisorRanking[]>;
}
