export class AgendaEvent {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly eventType: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly allDay: boolean,
    public readonly contactId: string | null,
    public readonly opportunityId: string | null,
    public readonly ownerId: string,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
