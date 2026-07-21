import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { ContactRepositoryPort } from '../../application/ports';
import { Contact } from '../../domain';

@Injectable()
export class PrismaContactRepositoryAdapter implements ContactRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<Contact> {
    const c = await this.prisma.contact.create({ data });
    return this.toDomain(c);
  }

  async findById(id: string): Promise<Contact | null> {
    const c = await this.prisma.contact.findUnique({ where: { id } });
    return c ? this.toDomain(c) : null;
  }

  async findByEmail(email: string): Promise<Contact | null> {
    const c = await this.prisma.contact.findUnique({ where: { email: email.toLowerCase() } });
    return c ? this.toDomain(c) : null;
  }

  async findByIdentityDocument(doc: string): Promise<Contact | null> {
    const c = await this.prisma.contact.findFirst({ where: { identityDocument: doc } });
    return c ? this.toDomain(c) : null;
  }

  async findAll(page = 1, limit = 20, search?: string): Promise<{ contacts: Contact[]; total: number }> {
    const where = search ? {
      OR: [
        { firstName: { contains: search, mode: 'insensitive' as const } },
        { lastName: { contains: search, mode: 'insensitive' as const } },
        { email: { contains: search, mode: 'insensitive' as const } },
        { phone: { contains: search } },
        { identityDocument: { contains: search } },
      ],
    } : {};
    const skip = (page - 1) * limit;
    const [contacts, total] = await Promise.all([
      this.prisma.contact.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.contact.count({ where }),
    ]);
    return { contacts: contacts.map(c => this.toDomain(c)), total };
  }

  async update(id: string, data: any): Promise<Contact> {
    const c = await this.prisma.contact.update({ where: { id }, data });
    return this.toDomain(c);
  }

  async markAsDuplicated(id: string, mergedIntoId: string): Promise<void> {
    await this.prisma.contact.update({ where: { id }, data: { isDuplicated: true, mergedIntoId } });
  }

  async findPotentialDuplicates(contactId: string): Promise<Contact[]> {
    const contact = await this.prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) return [];
    const duplicates = await this.prisma.contact.findMany({
      where: {
        id: { not: contactId },
        isDuplicated: false,
        OR: [
          { email: contact.email || '' },
          { identityDocument: contact.identityDocument || '' },
          { phone: contact.phone || '' },
          { firstName: contact.firstName, lastName: contact.lastName },
        ].filter(c => c.email || c.identityDocument || c.phone || (c.firstName && c.lastName)),
      },
    });
    return duplicates.map(c => this.toDomain(c));
  }

  private toDomain(c: any): Contact {
    return new Contact(c.id, c.firstName, c.lastName, c.email, c.phone, c.identityDocument, c.identityType, c.source, c.notes, c.isDuplicated, c.mergedIntoId, c.createdAt, c.updatedAt);
  }
}
