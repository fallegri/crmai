import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOCUMENT_REPOSITORY_PORT, DocumentRepositoryPort } from '../ports';
import { Document } from '../../domain';
@Injectable()
export class DocumentUseCase {
  constructor(@Inject(DOCUMENT_REPOSITORY_PORT) private readonly repo: DocumentRepositoryPort) {}
  async upload(data: { name: string; description?: string; fileUrl: string; fileType: string; fileSize?: number; contactId?: string; opportunityId?: string; uploadedBy: string }): Promise<Document> { return this.repo.create(data); }
  async findById(id: string): Promise<Document> { const d = await this.repo.findById(id); if (!d) throw new NotFoundException('Document not found'); return d; }
  async getContactDocuments(contactId: string): Promise<Document[]> { return this.repo.findByContactId(contactId); }
  async getOpportunityDocuments(opportunityId: string): Promise<Document[]> { return this.repo.findByOpportunityId(opportunityId); }
  async delete(id: string): Promise<void> { await this.findById(id); await this.repo.delete(id); }
}
