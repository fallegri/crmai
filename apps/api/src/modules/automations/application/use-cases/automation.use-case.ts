import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AUTOMATION_REPOSITORY_PORT, AutomationRepositoryPort } from '../ports';
import { AutomationRule } from '../../domain';
@Injectable()
export class AutomationUseCase {
  constructor(@Inject(AUTOMATION_REPOSITORY_PORT) private readonly repo: AutomationRepositoryPort) {}
  async create(data: { name: string; description?: string; triggerType: string; triggerConfig?: any; actionType: string; actionConfig?: any; priority?: number }): Promise<AutomationRule> {
    return this.repo.create(data);
  }
  async findAllActive(): Promise<AutomationRule[]> { return this.repo.findAllActive(); }
  async findById(id: string): Promise<AutomationRule> { const rule = await this.repo.findById(id); if (!rule) throw new NotFoundException('Rule not found'); return rule; }
  async update(id: string, data: any): Promise<AutomationRule> { await this.findById(id); return this.repo.update(id, data); }
  async delete(id: string): Promise<void> { await this.findById(id); await this.repo.delete(id); }
  async evaluateTriggers(eventType: string, context: any): Promise<AutomationRule[]> {
    const rules = await this.repo.findAllActive();
    return rules.filter(r => r.triggerType === eventType);
  }
}
