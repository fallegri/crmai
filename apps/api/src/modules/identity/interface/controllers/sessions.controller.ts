import { Controller, Get, Delete, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SessionManagementUseCase } from '../../application/use-cases';
import { JwtAuthGuard, OwnershipScopeGuard } from '../guards';
import { CurrentUser, OwnershipScope } from '../decorators';

@ApiTags('Sessions')
@Controller('sessions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SessionsController {
  constructor(private readonly sessionManagement: SessionManagementUseCase) {}

  @Get()
  @OwnershipScope('userId')
  @ApiOperation({ summary: 'List active sessions for current user' })
  async getActiveSessions(@CurrentUser('sub') userId: string) {
    return this.sessionManagement.getActiveSessions(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke a specific session' })
  async revokeSession(@Param('id') sessionId: string, @CurrentUser('sub') userId: string) {
    await this.sessionManagement.revokeSession(sessionId, userId);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke all sessions for current user' })
  async revokeAllSessions(@CurrentUser('sub') userId: string) {
    await this.sessionManagement.revokeAllSessions(userId);
  }
}
