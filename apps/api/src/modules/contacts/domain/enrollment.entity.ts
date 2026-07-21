export class Enrollment {
  constructor(
    public readonly id: string,
    public readonly opportunityId: string,
    public readonly enrollmentDate: Date,
    public readonly evidenceUrl: string | null,
    public readonly notes: string | null,
    public readonly enrolledBy: string,
    public readonly createdAt: Date,
  ) {}
}
