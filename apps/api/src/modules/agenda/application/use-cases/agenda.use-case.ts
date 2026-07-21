import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AGENDA_REPOSITORY_PORT, AgendaRepositoryPort } from '../ports';
import { AgendaEvent } from '../../domain';

@Injectable()
export class AgendaUseCase {
  constructor(
    @Inject(AGENDA_REPOSITORY_PORT)
    private readonly repo: AgendaRepositoryPort,
  ) {}

  async create(data: {
    title: string;
    description?: string;
    eventType?: string;
    startDate: Date;
    endDate: Date;
    allDay?: boolean;
    contactId?: string;
    opportunityId?: string;
    ownerId: string;
  }): Promise<AgendaEvent> {
    return this.repo.create(data);
  }

  async findById(id: string): Promise<AgendaEvent> {
    const event = await this.repo.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async getCalendar(
    ownerId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AgendaEvent[]> {
    return this.repo.findByOwner(ownerId, startDate, endDate);
  }

  async update(id: string, data: any): Promise<AgendaEvent> {
    await this.findById(id);
    return this.repo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.repo.delete(id);
  }
}
