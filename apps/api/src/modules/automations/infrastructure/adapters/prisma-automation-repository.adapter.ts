import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AutomationRepositoryPort } from '../../application/ports';
import { AutomationRule } from '../../domain';
@Injectable()
export class PrismaAutomationRepositoryAdapter implements AutomationRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any): Promise<AutomationRule> {
    const r = await this.prisma.automationRule.create({ data }); return this.toDomain(r);
  }
  async findAllActive(): Promise<AutomationRule[]> {
    const rules = await this.prisma.automationRule.findMany({ where: { isActive: true }, orderBy: { priority: 'asc' } }); return rules.map(r => this.toDomain(r));
  }
  async findById(id: string): Promise<AutomationRule | null> {
    const r = await this.prisma.automationRule.findUnique({ where: { id } }); return r ? this.toDomain(r) : null;
  }
  async update(id: string, data: any): Promise<AutomationRule> {
    const r = await this.prisma.automationRule.update({ where: { id }, data }); return this.toDomain(r);
  }
  async delete(id: string): Promise<void> { await this.prisma.automationRule.delete({ where: { id } }); }
  private toDomain(r: any): AutomationRule { return new AutomationRule(r.id, r.name, r.description, r.triggerType, r.triggerConfig, r.actionType, r.actionConfig, r.isActive, r.priority, r.createdAt, r.updatedAt); }
}
