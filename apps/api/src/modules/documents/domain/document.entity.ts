export class Document {
  constructor(
    public readonly id: string, public readonly name: string, public readonly description: string | null,
    public readonly fileUrl: string, public readonly fileType: string, public readonly fileSize: number,
    public readonly contactId: string | null, public readonly opportunityId: string | null,
    public readonly uploadedBy: string, public readonly createdAt: Date, public readonly updatedAt: Date,
  ) {}
}
