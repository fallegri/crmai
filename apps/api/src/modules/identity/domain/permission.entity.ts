export class Permission {
  constructor(
    public readonly id: string,
    public readonly module: string,
    public readonly action: string,
    public readonly description: string | null,
    public readonly createdAt: Date,
  ) {}

  get key(): string {
    return `${this.module}:${this.action}`;
  }
}
