import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CAMPAIGN_REPOSITORY_PORT, CampaignRepositoryPort } from '../ports';
import { Campaign } from '../../domain';
@Injectable()
export class CampaignUseCase {
  constructor(@Inject(CAMPAIGN_REPOSITORY_PORT) private readonly repo: CampaignRepositoryPort) {}
  async create(data: { name: string; description?: string; type?: string; startDate?: Date; endDate?: Date; config?: any; createdBy: string }): Promise<Campaign> { return this.repo.create(data); }
  async findById(id: string): Promise<Campaign> { const c = await this.repo.findById(id); if (!c) throw new NotFoundException('Campaign not found'); return c; }
  async findAll(page = 1, limit = 20): Promise<{ campaigns: Campaign[]; total: number }> { return this.repo.findAll(page, limit); }
  async update(id: string, data: any): Promise<Campaign> { await this.findById(id); return this.repo.update(id, data); }
  async delete(id: string): Promise<void> { await this.findById(id); await this.repo.delete(id); }
}
