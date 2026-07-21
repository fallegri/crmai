import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { CampaignRepositoryPort } from '../../application/ports';
import { Campaign } from '../../domain';
@Injectable()
export class PrismaCampaignRepositoryAdapter implements CampaignRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any): Promise<Campaign> { const c = await this.prisma.campaign.create({ data }); return this.toDomain(c); }
  async findById(id: string): Promise<Campaign | null> { const c = await this.prisma.campaign.findUnique({ where: { id } }); return c ? this.toDomain(c) : null; }
  async findAll(page = 1, limit = 20): Promise<{ campaigns: Campaign[]; total: number }> { const skip = (page - 1) * limit; const [campaigns, total] = await Promise.all([this.prisma.campaign.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }), this.prisma.campaign.count()]); return { campaigns: campaigns.map(c => this.toDomain(c)), total }; }
  async update(id: string, data: any): Promise<Campaign> { const c = await this.prisma.campaign.update({ where: { id }, data }); return this.toDomain(c); }
  async delete(id: string): Promise<void> { await this.prisma.campaign.delete({ where: { id } }); }
  private toDomain(c: any): Campaign { return new Campaign(c.id, c.name, c.description, c.type, c.status, c.startDate, c.endDate, c.config, c.createdBy, c.createdAt, c.updatedAt); }
}
