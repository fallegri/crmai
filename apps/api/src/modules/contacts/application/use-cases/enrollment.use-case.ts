import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OPPORTUNITY_REPOSITORY_PORT, OpportunityRepositoryPort } from '../ports';
import { Enrollment, OpportunityStatus } from '../../domain';

@Injectable()
export class EnrollmentUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY_PORT) private readonly repo: OpportunityRepositoryPort,
  ) {}

  async enroll(opportunityId: string, enrolledBy: string, evidenceUrl?: string, notes?: string): Promise<Enrollment> {
    const opp = await this.repo.findById(opportunityId);
    if (!opp) throw new NotFoundException('Opportunity not found');
    if (!opp.isActive()) {
      throw new Error('Cannot enroll a won or lost opportunity');
    }
    const enrollment = await this.repo.createEnrollment({ opportunityId, evidenceUrl, notes, enrolledBy });
    await this.repo.updateStatus(opportunityId, OpportunityStatus.WON);
    return enrollment;
  }

  async getEnrollments(opportunityId: string): Promise<Enrollment[]> {
    return this.repo.findEnrollmentsByOpportunityId(opportunityId);
  }
}
