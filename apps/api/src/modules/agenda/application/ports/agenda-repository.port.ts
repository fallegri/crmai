import { AgendaEvent } from '../../domain';

export const AGENDA_REPOSITORY_PORT = 'AgendaRepositoryPort';

export interface AgendaRepositoryPort {
  create(data: { title: string; description?: string; eventType?: string; startDate: Date; endDate: Date; allDay?: boolean; contactId?: string; opportunityId?: string; ownerId: string; status?: string }): Promise<AgendaEvent>;
  findById(id: string): Promise<AgendaEvent | null>;
  findByOwner(ownerId: string, startDate?: Date, endDate?: Date): Promise<AgendaEvent[]>;
  update(id: string, data: Partial<AgendaEvent>): Promise<AgendaEvent>;
  delete(id: string): Promise<void>;
}
