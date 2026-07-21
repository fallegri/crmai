import { Inject, Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { USER_REPOSITORY_PORT, UserRepositoryPort } from '../ports';
import { Role, Permission } from '../../domain';

@Injectable()
export class RoleManagementUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepo: UserRepositoryPort,
  ) {}

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    const hasRole = user.roles.some(r => r.id === roleId);
    if (hasRole) throw new ConflictException('User already has this role');
    await this.userRepo.assignRole(userId, roleId);
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.removeRole(userId, roleId);
  }

  async getUserPermissions(userId: string): Promise<Permission[]> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    return this.userRepo.findPermissionsByUserId(userId);
  }
}
