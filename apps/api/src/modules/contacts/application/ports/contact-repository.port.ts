import { Contact } from '../../domain';

export const CONTACT_REPOSITORY_PORT = 'ContactRepositoryPort';

export interface ContactRepositoryPort {
  create(data: { firstName: string; lastName: string; email?: string; phone?: string; identityDocument?: string; identityType?: string; source?: string; notes?: string }): Promise<Contact>;
  findById(id: string): Promise<Contact | null>;
  findByEmail(email: string): Promise<Contact | null>;
  findByIdentityDocument(doc: string): Promise<Contact | null>;
  findAll(page?: number, limit?: number, search?: string): Promise<{ contacts: Contact[]; total: number }>;
  update(id: string, data: Partial<Contact>): Promise<Contact>;
  markAsDuplicated(id: string, mergedIntoId: string): Promise<void>;
  findPotentialDuplicates(contactId: string): Promise<Contact[]>;
}
