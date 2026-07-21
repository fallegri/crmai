import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CONTACT_REPOSITORY_PORT, ContactRepositoryPort, DEDUPLICATION_PORT, DeduplicationPort } from '../ports';
import { Contact } from '../../domain';

@Injectable()
export class ContactUseCase {
  constructor(
    @Inject(CONTACT_REPOSITORY_PORT) private readonly repo: ContactRepositoryPort,
    @Inject(DEDUPLICATION_PORT) private readonly dedup: DeduplicationPort,
  ) {}

  async create(data: { firstName: string; lastName: string; email?: string; phone?: string; identityDocument?: string; identityType?: string; source?: string; notes?: string }): Promise<{ contact: Contact; possibleDuplicates: Contact[] }> {
    const matches = await this.dedup.findMatches({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      identityDocument: data.identityDocument,
    });
    if (matches.exactMatch) {
      throw new ConflictException('Contact already exists (exact match by email or identity document)');
    }
    const contact = await this.repo.create(data);
    return { contact, possibleDuplicates: matches.possibleMatches };
  }

  async findById(id: string): Promise<Contact> {
    const contact = await this.repo.findById(id);
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async findAll(page = 1, limit = 20, search?: string): Promise<{ contacts: Contact[]; total: number }> {
    return this.repo.findAll(page, limit, search);
  }

  async update(id: string, data: Partial<Contact>): Promise<Contact> {
    await this.findById(id);
    return this.repo.update(id, data);
  }

  async findPotentialDuplicates(contactId: string): Promise<Contact[]> {
    return this.repo.findPotentialDuplicates(contactId);
  }

  async mergeContacts(primaryId: string, secondaryId: string): Promise<Contact> {
    const primary = await this.findById(primaryId);
    const secondary = await this.findById(secondaryId);
    if (!primary.canAutoMerge(secondary)) {
      throw new ConflictException('Contacts cannot be auto-merged. Manual review required.');
    }
    await this.repo.markAsDuplicated(secondaryId, primaryId);
    return primary;
  }
}
