import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DeduplicationPort } from '../../application/ports';
import { Contact } from '../../domain';

@Injectable()
export class BasicDeduplicationAdapter implements DeduplicationPort {
  constructor(private readonly prisma: PrismaService) {}

  async findMatches(data: { firstName: string; lastName: string; email?: string; phone?: string; identityDocument?: string }): Promise<{ exactMatch?: Contact; possibleMatches: Contact[] }> {
    let exactMatch: Contact | undefined;
    if (data.identityDocument) {
      const byDoc = await this.prisma.contact.findFirst({ where: { identityDocument: data.identityDocument } });
      if (byDoc) exactMatch = this.toDomain(byDoc);
    }
    if (!exactMatch && data.email) {
      const byEmail = await this.prisma.contact.findUnique({ where: { email: data.email.toLowerCase() } });
      if (byEmail) exactMatch = this.toDomain(byEmail);
    }
    const possibleMatches: Contact[] = [];
    if (data.phone) {
      const byPhone = await this.prisma.contact.findFirst({ where: { phone: data.phone } });
      if (byPhone) possibleMatches.push(this.toDomain(byPhone));
    }
    if (data.firstName && data.lastName) {
      const byName = await this.prisma.contact.findMany({
        where: { firstName: data.firstName, lastName: data.lastName },
        take: 5,
      });
      for (const c of byName) {
        if (!possibleMatches.find(p => p.id === c.id) && (!exactMatch || exactMatch.id !== c.id)) {
          possibleMatches.push(this.toDomain(c));
        }
      }
    }
    return { exactMatch, possibleMatches };
  }

  private toDomain(c: any): Contact {
    return new Contact(c.id, c.firstName, c.lastName, c.email, c.phone, c.identityDocument, c.identityType, c.source, c.notes, c.isDuplicated, c.mergedIntoId, c.createdAt, c.updatedAt);
  }
}
