import { User, Role, Permission } from '../../domain';

export interface CreateUserDto {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  status?: string;
}

export interface UserWithRoles extends User {
  roles: Role[];
}

export interface RoleWithPermissions extends Role {
  permissions: Permission[];
}

export const USER_REPOSITORY_PORT = 'UserRepositoryPort';

export interface UserRepositoryPort {
  create(dto: CreateUserDto): Promise<User>;
  findById(id: string): Promise<UserWithRoles | null>;
  findByEmail(email: string): Promise<UserWithRoles | null>;
  findAll(page?: number, limit?: number): Promise<{ users: UserWithRoles[]; total: number }>;
  update(id: string, dto: UpdateUserDto): Promise<User>;
  assignRole(userId: string, roleId: string): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;
  findRolesByUserId(userId: string): Promise<Role[]>;
  findPermissionsByUserId(userId: string): Promise<Permission[]>;
}
