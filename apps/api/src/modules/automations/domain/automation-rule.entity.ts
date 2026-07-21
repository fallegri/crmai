export class AutomationRule {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly triggerType: string,
    public readonly triggerConfig: Record<string, any> | null,
    public readonly actionType: string,
    public readonly actionConfig: Record<string, any> | null,
    public readonly isActive: boolean,
    public readonly priority: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
