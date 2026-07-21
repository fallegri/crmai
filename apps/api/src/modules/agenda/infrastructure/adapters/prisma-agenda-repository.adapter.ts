import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { AgendaRepositoryPort } from '../../application/ports';
import { AgendaEvent } from '../../domain';

@Injectable()
export class PrismaAgendaRepositoryAdapter implements AgendaRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<AgendaEvent> {
    const e = await this.prisma.agendaEvent.create({ data });
    return this.toDomain(e);
  }

  async findById(id: string): Promise<AgendaEvent | null> {
    const e = await this.prisma.agendaEvent.findUnique({ where: { id } });
    return e ? this.toDomain(e) : null;
  }

  async findByOwner(
    ownerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AgendaEvent[]> {
    const where: any = { ownerId };
    if (startDate || endDate) {
      where.OR = [];
      if (startDate) where.OR.push({ startDate: { gte: startDate } });
      if (endDate) where.OR.push({ endDate: { lte: endDate } });
    }
    const events = await this.prisma.agendaEvent.findMany({
      where,
      orderBy: { startDate: 'asc' },
    });
    return events.map((e) => this.toDomain(e));
  }

  async update(id: string, data: any): Promise<AgendaEvent> {
    const e = await this.prisma.agendaEvent.update({ where: { id }, data });
    return this.toDomain(e);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.agendaEvent.delete({ where: { id } });
  }

  private toDomain(e: any): AgendaEvent {
    return new AgendaEvent(
      e.id,
      e.title,
      e.description,
      e.eventType,
      e.startDate,
      e.endDate,
      e.allDay,
      e.contactId,
      e.opportunityId,
      e.ownerId,
      e.status,
      e.createdAt,
      e.updatedAt,
    );
  }
}
