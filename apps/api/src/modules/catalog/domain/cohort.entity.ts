export class Cohort {
  constructor(
    public readonly id: string,
    public readonly programId: string,
    public readonly name: string,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
