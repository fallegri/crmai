export class Campaign {
  constructor(
    public readonly id: string, public readonly name: string, public readonly description: string | null,
    public readonly type: string, public readonly status: string, public readonly startDate: Date | null,
    public readonly endDate: Date | null, public readonly config: Record<string, any> | null,
    public readonly createdBy: string, public readonly createdAt: Date, public readonly updatedAt: Date,
  ) {}
}
