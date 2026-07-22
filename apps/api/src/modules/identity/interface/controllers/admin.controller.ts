import { Controller, Get, Post, Patch, Put, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../../../../prisma/prisma.service';
import { JwtAuthGuard, PermissionsGuard } from '../guards';
import { RequirePermission } from '../decorators';
import { IsEmail, IsString, MinLength, IsOptional, IsArray, IsIn } from 'class-validator';

export class CreateUserDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsOptional() @IsString() roleId?: string;
  @IsOptional() @IsIn(['ACTIVE', 'INACTIVE', 'BLOCKED']) status?: string;
}

class UpdateStatusDto {
  @IsIn(['ACTIVE', 'INACTIVE', 'BLOCKED']) status: string;
}

class UpdateRolesDto {
  @IsArray() roleIds: string[];
}

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermission('admin', 'manage')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('users')
  @ApiOperation({ summary: 'List all users with roles' })
  async listUsers(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = {};
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        include: { userRoles: { include: { role: { select: { id: true, name: true, description: true } } } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);
    return {
      data: users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        status: u.status,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        roles: u.userRoles.map(ur => ur.role),
      })),
      total,
      page: Number(page),
      limit: Number(limit),
    };
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user details' })
  async getUser(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { userRoles: { include: { role: { select: { id: true, name: true, description: true } } } } },
    });
    if (!user) return { message: 'User not found' };
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles.map(ur => ur.role),
    };
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a user (admin)' })
  async createUser(@Body() dto: CreateUserDto) {
    const bcrypt = await import('bcrypt');
    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        status: (dto.status as any) || 'ACTIVE',
      },
    });
    if (dto.roleId) {
      await this.prisma.userRole.create({ data: { userId: user.id, roleId: dto.roleId } });
    }
    return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, status: user.status };
  }

  @Patch('users/:id/status')
  @ApiOperation({ summary: 'Update user status (approve/reject)' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    const user = await this.prisma.user.update({ where: { id }, data: { status: dto.status as any } });
    return { id: user.id, email: user.email, status: user.status };
  }

  @Put('users/:id/roles')
  @ApiOperation({ summary: 'Replace user roles' })
  async updateRoles(@Param('id') id: string, @Body() dto: UpdateRolesDto) {
    await this.prisma.userRole.deleteMany({ where: { userId: id } });
    if (dto.roleIds.length > 0) {
      await this.prisma.userRole.createMany({
        data: dto.roleIds.map(roleId => ({ userId: id, roleId })),
      });
    }
    return { message: 'Roles updated' };
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  async deleteUser(@Param('id') id: string) {
    await this.prisma.user.delete({ where: { id } });
  }

  @Get('roles')
  @ApiOperation({ summary: 'List all roles with permissions' })
  async listRoles() {
    return this.prisma.role.findMany({
      include: {
        permissions: { include: { permission: { select: { id: true, module: true, action: true, description: true } } } },
        _count: { select: { userRoles: true } },
      },
      orderBy: { name: 'asc' },
    });
  }
}
