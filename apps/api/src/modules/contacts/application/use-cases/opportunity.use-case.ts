import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { OPPORTUNITY_REPOSITORY_PORT, OpportunityRepositoryPort, CONTACT_REPOSITORY_PORT, ContactRepositoryPort } from '../ports';
import { Opportunity, OpportunityStatus, Enrollment } from '../../domain';

@Injectable()
export class OpportunityUseCase {
  constructor(
    @Inject(OPPORTUNITY_REPOSITORY_PORT) private readonly repo: OpportunityRepositoryPort,
    @Inject(CONTACT_REPOSITORY_PORT) private readonly contactRepo: ContactRepositoryPort,
  ) {}

  async create(data: { contactId: string; programId: string; cohortId?: string; source?: string; assignedAdvisorId?: string; notes?: string }): Promise<Opportunity> {
    const contact = await this.contactRepo.findById(data.contactId);
    if (!contact) throw new NotFoundException('Contact not found');
    return this.repo.create(data);
  }

  async findById(id: string): Promise<Opportunity> {
    const opp = await this.repo.findById(id);
    if (!opp) throw new NotFoundException('Opportunity not found');
    return opp;
  }

  async findByContactId(contactId: string): Promise<Opportunity[]> {
    return this.repo.findByContactId(contactId);
  }

  async findAll(page = 1, limit = 20, stageId?: string, advisorId?: string): Promise<{ opportunities: Opportunity[]; total: number }> {
    return this.repo.findAll(page, limit, stageId, advisorId);
  }

  async moveToStage(opportunityId: string, stageId: string): Promise<Opportunity> {
    const opp = await this.findById(opportunityId);
    if (opp.isWon() || opp.isLost()) {
      throw new Error('Cannot move a won or lost opportunity to another stage');
    }
    return this.repo.updateStage(opportunityId, stageId);
  }

  async assignAdvisor(opportunityId: string, advisorId: string): Promise<Opportunity> {
    return this.repo.assignAdvisor(opportunityId, advisorId);
  }

  async markAsWon(opportunityId: string): Promise<Opportunity> {
    return this.repo.updateStatus(opportunityId, OpportunityStatus.WON);
  }

  async markAsLost(opportunityId: string): Promise<Opportunity> {
    return this.repo.updateStatus(opportunityId, OpportunityStatus.LOST);
  }
}
