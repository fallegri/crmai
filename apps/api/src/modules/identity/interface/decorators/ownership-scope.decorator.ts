import { SetMetadata } from '@nestjs/common';

export const OWNERSHIP_SCOPE_KEY = 'ownership_scope';
export const OwnershipScope = (paramName: string, userIdField?: string) =>
  SetMetadata(OWNERSHIP_SCOPE_KEY, { paramName, userIdField });
