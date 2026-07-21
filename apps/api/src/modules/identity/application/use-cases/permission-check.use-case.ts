import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports';

@Injectable()
export class PermissionCheckUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepo: UserRepositoryPort,
  ) {}

  async hasPermission(userId: string, module: string, action: string): Promise<boolean> {
    const permissions = await this.userRepo.findPermissionsByUserId(userId);
    return permissions.some(p => p.module === module && p.action === action);
  }

  async hasAnyPermission(userId: string, permissions: { module: string; action: string }[]): Promise<boolean> {
    const userPermissions = await this.userRepo.findPermissionsByUserId(userId);
    return permissions.some(p =>
      userPermissions.some(up => up.module === p.module && up.action === p.action),
    );
  }

  async hasAllPermissions(userId: string, permissions: { module: string; action: string }[]): Promise<boolean> {
    const userPermissions = await this.userRepo.findPermissionsByUserId(userId);
    return permissions.every(p =>
      userPermissions.some(up => up.module === p.module && up.action === p.action),
    );
  }
}
