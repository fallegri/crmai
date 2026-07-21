export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly token: string,
    public readonly ipAddress: string | null,
    public readonly userAgent: string | null,
    public readonly expiresAt: Date,
    public readonly createdAt: Date,
    public revokedAt: Date | null,
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isRevoked();
  }
}
