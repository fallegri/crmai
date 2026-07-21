import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { UserRepositoryPort, CreateUserDto, UpdateUserDto, UserWithRoles } from '../../application/ports';
import { User, UserStatus, Role, Permission } from '../../domain';

@Injectable()
export class PrismaUserRepositoryAdapter implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: dto.passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
      },
    });
    return this.toDomain(user);
  }

  async findById(id: string): Promise<UserWithRoles | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
    if (!user) return null;
    return this.toDomainWithRoles(user);
  }

  async findByEmail(email: string): Promise<UserWithRoles | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
    if (!user) return null;
    return this.toDomainWithRoles(user);
  }

  async findAll(page = 1, limit = 20): Promise<{ users: UserWithRoles[]; total: number }> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        include: {
          userRoles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);
    return { users: users.map(u => this.toDomainWithRoles(u)), total };
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.status && { status: dto.status as any }),
      },
    });
    return this.toDomain(user);
  }

  async assignRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.create({ data: { userId, roleId } });
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await this.prisma.userRole.delete({ where: { userId_roleId: { userId, roleId } } });
  }

  async findRolesByUserId(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: { role: true },
    });
    return userRoles.map(ur => new Role(ur.role.id, ur.role.name, ur.role.description, ur.role.isSystem, ur.role.createdAt, ur.role.updatedAt));
  }

  async findPermissionsByUserId(userId: string): Promise<Permission[]> {
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: { permissions: { include: { permission: true } } },
        },
      },
    });
    const permissionMap = new Map<string, Permission>();
    for (const ur of userRoles) {
      for (const rp of ur.role.permissions) {
        const p = rp.permission;
        if (!permissionMap.has(p.id)) {
          permissionMap.set(p.id, new Permission(p.id, p.module, p.action, p.description, p.createdAt));
        }
      }
    }
    return Array.from(permissionMap.values());
  }

  private toDomain(user: any): User {
    return new User(
      user.id, user.email, user.passwordHash,
      user.firstName, user.lastName,
      user.status as UserStatus,
      user.twoFactorEnabled, user.twoFactorSecret,
      user.createdAt, user.updatedAt,
    );
  }

  private toDomainWithRoles(user: any): UserWithRoles {
    const domainUser = this.toDomain(user);
    const roles = (user.userRoles || []).map((ur: any) =>
      new Role(ur.role.id, ur.role.name, ur.role.description, ur.role.isSystem, ur.role.createdAt, ur.role.updatedAt),
    );
    return Object.assign(domainUser, { roles }) as UserWithRoles;
  }
}
