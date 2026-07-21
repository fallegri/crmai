import { Document } from '../../domain';
export const DOCUMENT_REPOSITORY_PORT = 'DocumentRepositoryPort';
export interface DocumentRepositoryPort {
  create(data: { name: string; description?: string; fileUrl: string; fileType: string; fileSize?: number; contactId?: string; opportunityId?: string; uploadedBy: string }): Promise<Document>;
  findById(id: string): Promise<Document | null>;
  findByContactId(contactId: string): Promise<Document[]>;
  findByOpportunityId(opportunityId: string): Promise<Document[]>;
  delete(id: string): Promise<void>;
}
