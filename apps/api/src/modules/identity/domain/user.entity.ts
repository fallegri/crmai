export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLOCKED = 'BLOCKED',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public passwordHash: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public status: UserStatus,
    public twoFactorEnabled: boolean,
    public twoFactorSecret: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  block(): void {
    this.status = UserStatus.BLOCKED;
  }

  activate(): void {
    this.status = UserStatus.ACTIVE;
  }

  enable2FA(secret: string): void {
    this.twoFactorEnabled = true;
    this.twoFactorSecret = secret;
  }

  disable2FA(): void {
    this.twoFactorEnabled = false;
    this.twoFactorSecret = null;
  }

  updatePassword(hash: string): void {
    this.passwordHash = hash;
  }
}
