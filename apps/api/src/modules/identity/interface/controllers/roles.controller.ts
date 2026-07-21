import { Controller, Post, Delete, Param, Body, UseGuards, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RoleManagementUseCase } from '../../application/use-cases';
import { JwtAuthGuard, PermissionsGuard } from '../guards';
import { RequirePermission } from '../decorators';
import { AssignRoleDto } from '../dto';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly roleManagement: RoleManagementUseCase) {}

  @Post('users/:userId/assign')
  @RequirePermission('identity', 'manage-roles')
  @ApiOperation({ summary: 'Assign a role to a user' })
  async assignRole(@Param('userId') userId: string, @Body() dto: AssignRoleDto) {
    await this.roleManagement.assignRoleToUser(userId, dto.roleId);
    return { message: 'Role assigned successfully' };
  }

  @Delete('users/:userId/roles/:roleId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission('identity', 'manage-roles')
  @ApiOperation({ summary: 'Remove a role from a user' })
  async removeRole(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    await this.roleManagement.removeRoleFromUser(userId, roleId);
  }

  @Get('users/:userId/permissions')
  @RequirePermission('identity', 'view-permissions')
  @ApiOperation({ summary: 'Get permissions for a user' })
  async getUserPermissions(@Param('userId') userId: string) {
    return this.roleManagement.getUserPermissions(userId);
  }
}
