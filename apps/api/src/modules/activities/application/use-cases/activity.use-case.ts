import { Inject, Injectable } from '@nestjs/common';
import { ACTIVITY_REPOSITORY_PORT, ActivityRepositoryPort } from '../ports';
import { ActivityEvent } from '../../domain';

@Injectable()
export class ActivityUseCase {
  constructor(
    @Inject(ACTIVITY_REPOSITORY_PORT) private readonly repo: ActivityRepositoryPort,
  ) {}

  async record(data: { contactId?: string; opportunityId?: string; type: string; title: string; description?: string; metadata?: any; actorId: string }): Promise<ActivityEvent> {
    return this.repo.create(data);
  }

  async getContactTimeline(contactId: string, cursor?: string, limit = 20): Promise<{ events: ActivityEvent[]; nextCursor?: string }> {
    return this.repo.findByContactId(contactId, cursor, limit);
  }

  async getOpportunityTimeline(opportunityId: string, cursor?: string, limit = 20): Promise<{ events: ActivityEvent[]; nextCursor?: string }> {
    return this.repo.findByOpportunityId(opportunityId, cursor, limit);
  }
}
