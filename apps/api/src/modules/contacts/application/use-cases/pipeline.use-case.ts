import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OPPORTUNITY_REPOSITORY_PORT, OpportunityRepositoryPort } from '../ports';
import { PipelineStage } from '../../domain';

@Injectable()
export class PipelineUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY_PORT) private readonly repo: OpportunityRepositoryPort,
  ) {}

  async getAllStages(): Promise<PipelineStage[]> {
    return this.repo.findAllStages();
  }

  async createStage(data: { name: string; position: number; isTerminal?: boolean; color?: string }): Promise<PipelineStage> {
    return this.repo.createStage(data);
  }

  async updateStage(id: string, data: { name?: string; position?: number; isTerminal?: boolean; color?: string }): Promise<PipelineStage> {
    const stages = await this.repo.findAllStages();
    const stage = stages.find(s => s.id === id);
    if (!stage) throw new NotFoundException('Pipeline stage not found');
    if (PipelineStage.TERMINAL_STAGES.includes(stage.name) && data.isTerminal === false) {
      throw new Error('Cannot change terminal flag on fixed stages');
    }
    return this.repo.updateStage(id, data);
  }

  async deleteStage(id: string): Promise<void> {
    return this.repo.deleteStage(id);
  }
}
