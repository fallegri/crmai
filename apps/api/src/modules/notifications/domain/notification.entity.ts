export class Notification {
  constructor(
    public readonly id: string, public readonly userId: string, public readonly type: string,
    public readonly title: string, public readonly body: string | null, public readonly channel: string,
    public readonly metadata: Record<string, any> | null, public readonly readAt: Date | null, public readonly createdAt: Date,
  ) {}
  isRead(): boolean { return this.readAt !== null; }
  markAsRead(): void { this.readAt = new Date(); }
}
