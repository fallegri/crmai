export class AdvisorAssignment {
  constructor(
    public readonly id: string,
    public readonly advisorId: string,
    public readonly programId: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
