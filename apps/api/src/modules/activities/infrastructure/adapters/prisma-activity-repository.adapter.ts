import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ActivityRepositoryPort } from '../../application/ports';
import { ActivityEvent } from '../../domain';

@Injectable()
export class PrismaActivityRepositoryAdapter implements ActivityRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<ActivityEvent> {
    const e = await this.prisma.activityEvent.create({ data: { contactId: data.contactId || null, opportunityId: data.opportunityId || null, type: data.type, title: data.title, description: data.description || null, metadata: data.metadata || undefined, actorId: data.actorId } });
    return this.toDomain(e);
  }

  async findByContactId(contactId: string, cursor?: string, limit = 20): Promise<{ events: ActivityEvent[]; nextCursor?: string }> {
    const query: any = { where: { contactId }, take: limit + 1, orderBy: { createdAt: 'desc' as const } };
    if (cursor) query.cursor = { id: cursor }; query.skip = 1;
    const events = await this.prisma.activityEvent.findMany(query);
    return this.paginate(events, limit);
  }

  async findByOpportunityId(opportunityId: string, cursor?: string, limit = 20): Promise<{ events: ActivityEvent[]; nextCursor?: string }> {
    const query: any = { where: { opportunityId }, take: limit + 1, orderBy: { createdAt: 'desc' as const } };
    if (cursor) query.cursor = { id: cursor }; query.skip = 1;
    const events = await this.prisma.activityEvent.findMany(query);
    return this.paginate(events, limit);
  }

  async findByActorId(actorId: string, cursor?: string, limit = 20): Promise<{ events: ActivityEvent[]; nextCursor?: string }> {
    const query: any = { where: { actorId }, take: limit + 1, orderBy: { createdAt: 'desc' as const } };
    if (cursor) query.cursor = { id: cursor }; query.skip = 1;
    const events = await this.prisma.activityEvent.findMany(query);
    return this.paginate(events, limit);
  }

  private paginate(events: any[], limit: number): { events: ActivityEvent[]; nextCursor?: string } {
    const hasMore = events.length > limit;
    const items = hasMore ? events.slice(0, limit) : events;
    return { events: items.map(e => this.toDomain(e)), nextCursor: hasMore ? items[items.length - 1].id : undefined };
  }

  private toDomain(e: any): ActivityEvent {
    return new ActivityEvent(e.id, e.contactId, e.opportunityId, e.type, e.title, e.description, e.metadata, e.actorId, e.createdAt);
  }
}
