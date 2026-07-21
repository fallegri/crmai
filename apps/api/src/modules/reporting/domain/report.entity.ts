export class DashboardReport {
  constructor(
    public readonly id: string, public readonly name: string, public readonly description: string | null,
    public readonly type: string, public readonly config: Record<string, any> | null,
    public readonly createdBy: string, public readonly createdAt: Date, public readonly updatedAt: Date,
  ) {}
}

export interface FunnelData {
  stage: string; count: number; percentage: number;
}

export interface ConversionData {
  dimension: string; value: string; total: number; converted: number; conversionRate: number;
}

export interface AdvisorRanking {
  advisorId: string; advisorName: string; opportunitiesCount: number; wonCount: number; conversionRate: number;
}
