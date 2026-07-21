import { Contact } from '../../domain';

export const DEDUPLICATION_PORT = 'DeduplicationPort';

export interface DeduplicationPort {
  findMatches(contact: { firstName: string; lastName: string; email?: string; phone?: string; identityDocument?: string }): Promise<{ exactMatch?: Contact; possibleMatches: Contact[] }>;
}
