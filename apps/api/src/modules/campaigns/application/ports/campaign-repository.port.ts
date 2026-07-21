import { Campaign } from '../../domain';
export const CAMPAIGN_REPOSITORY_PORT = 'CampaignRepositoryPort';
export interface CampaignRepositoryPort {
  create(data: { name: string; description?: string; type?: string; startDate?: Date; endDate?: Date; config?: any; createdBy: string }): Promise<Campaign>;
  findById(id: string): Promise<Campaign | null>;
  findAll(page?: number, limit?: number): Promise<{ campaigns: Campaign[]; total: number }>;
  update(id: string, data: Partial<Campaign>): Promise<Campaign>;
  delete(id: string): Promise<void>;
}
