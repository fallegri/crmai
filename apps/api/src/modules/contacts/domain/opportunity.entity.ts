export enum OpportunityStatus {
  ACTIVE = 'ACTIVE',
  WON = 'WON',
  LOST = 'LOST',
}

export class Opportunity {
  constructor(
    public readonly id: string,
    public readonly contactId: string,
    public readonly programId: string,
    public readonly cohortId: string | null,
    public readonly currentStageId: string,
    public readonly assignedAdvisorId: string | null,
    public readonly source: string | null,
    public readonly status: OpportunityStatus,
    public readonly notes: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isActive(): boolean {
    return this.status === OpportunityStatus.ACTIVE;
  }

  isWon(): boolean {
    return this.status === OpportunityStatus.WON;
  }

  isLost(): boolean {
    return this.status === OpportunityStatus.LOST;
  }
}
