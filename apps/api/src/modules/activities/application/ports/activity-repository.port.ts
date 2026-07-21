import { ActivityEvent } from '../../domain';

export const ACTIVITY_REPOSITORY_PORT = 'ActivityRepositoryPort';

export interface ActivityRepositoryPort {
  create(data: { contactId?: string; opportunityId?: string; type: string; title: string; description?: string; metadata?: any; actorId: string }): Promise<ActivityEvent>;
  findByContactId(contactId: string, cursor?: string, limit?: number): Promise<{ events: ActivityEvent[]; nextCursor?: string }>;
  findByOpportunityId(opportunityId: string, cursor?: string, limit?: number): Promise<{ events: ActivityEvent[]; nextCursor?: string }>;
  findByActorId(actorId: string, cursor?: string, limit?: number): Promise<{ events: ActivityEvent[]; nextCursor?: string }>;
}
