export class ActivityEvent {
  constructor(
    public readonly id: string,
    public readonly contactId: string | null,
    public readonly opportunityId: string | null,
    public readonly type: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly metadata: Record<string, any> | null,
    public readonly actorId: string,
    public readonly createdAt: Date,
  ) {}
}
