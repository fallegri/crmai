import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { SESSION_PORT, SessionPort } from '../ports';
import { Session } from '../../domain';

@Injectable()
export class SessionManagementUseCase {
  constructor(
    @Inject(SESSION_PORT) private readonly sessionPort: SessionPort,
  ) {}

  async getActiveSessions(userId: string): Promise<Session[]> {
    return this.sessionPort.findActiveByUserId(userId);
  }

  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const sessions = await this.sessionPort.findActiveByUserId(userId);
    const session = sessions.find(s => s.id === sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found or not owned by user');
    }
    await this.sessionPort.revoke(sessionId);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.sessionPort.revokeAllByUserId(userId);
  }
}
