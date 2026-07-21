import { Inject, Injectable } from '@nestjs/common';
import { OPPORTUNITY_REPOSITORY_PORT, OpportunityRepositoryPort, ASSIGNMENT_STRATEGY_PORT, AssignmentStrategyPort } from '../ports';

@Injectable()
export class AssignmentUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY_PORT) private readonly oppRepo: OpportunityRepositoryPort,
    @Inject(ASSIGNMENT_STRATEGY_PORT) private readonly strategy: AssignmentStrategyPort,
  ) {}

  async autoAssign(opportunityId: string, programId: string): Promise<void> {
    const advisorId = await this.strategy.selectAdvisor(programId);
    if (advisorId) {
      await this.oppRepo.assignAdvisor(opportunityId, advisorId);
    }
  }

  async manualAssign(opportunityId: string, advisorId: string): Promise<void> {
    await this.oppRepo.assignAdvisor(opportunityId, advisorId);
  }
}
