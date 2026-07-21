export class Program {
  constructor(
    public readonly id: string,
    public readonly facultyId: string,
    public readonly name: string,
    public readonly code: string,
    public readonly description: string | null,
    public readonly durationMonths: number,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
