export class Contact {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly identityDocument: string | null,
    public readonly identityType: string | null,
    public readonly source: string | null,
    public readonly notes: string | null,
    public readonly isDuplicated: boolean,
    public readonly mergedIntoId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  canAutoMerge(other: Contact): boolean {
    if (this.identityDocument && other.identityDocument && this.identityDocument === other.identityDocument) return true;
    if (this.email && other.email && this.email.toLowerCase() === other.email.toLowerCase()) return true;
    return false;
  }

  needsHumanReview(other: Contact): boolean {
    if (this.phone && other.phone && this.phone === other.phone) return true;
    if (this.fullName.toLowerCase() === other.fullName.toLowerCase()) return true;
    return false;
  }
}
