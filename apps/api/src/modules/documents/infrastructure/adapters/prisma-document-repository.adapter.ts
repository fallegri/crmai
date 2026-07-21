import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { DocumentRepositoryPort } from '../../application/ports';
import { Document } from '../../domain';
@Injectable()
export class PrismaDocumentRepositoryAdapter implements DocumentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any): Promise<Document> { const d = await this.prisma.document.create({ data }); return this.toDomain(d); }
  async findById(id: string): Promise<Document | null> { const d = await this.prisma.document.findUnique({ where: { id } }); return d ? this.toDomain(d) : null; }
  async findByContactId(contactId: string): Promise<Document[]> { const docs = await this.prisma.document.findMany({ where: { contactId }, orderBy: { createdAt: 'desc' } }); return docs.map(d => this.toDomain(d)); }
  async findByOpportunityId(opportunityId: string): Promise<Document[]> { const docs = await this.prisma.document.findMany({ where: { opportunityId }, orderBy: { createdAt: 'desc' } }); return docs.map(d => this.toDomain(d)); }
  async delete(id: string): Promise<void> { await this.prisma.document.delete({ where: { id } }); }
  private toDomain(d: any): Document { return new Document(d.id, d.name, d.description, d.fileUrl, d.fileType, d.fileSize, d.contactId, d.opportunityId, d.uploadedBy, d.createdAt, d.updatedAt); }
}
