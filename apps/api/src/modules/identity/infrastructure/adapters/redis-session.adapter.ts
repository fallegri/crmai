import { Injectable } from '@nestjs/common';
import { SessionPort } from '../../application/ports';
import { Session } from '../../domain';

@Injectable()
export class RedisSessionAdapter implements SessionPort {
  private sessions: Map<string, Session> = new Map();

  async create(session: Session): Promise<void> {
    this.sessions.set(session.token, session);
  }

  async findByToken(token: string): Promise<Session | null> {
    const session = this.sessions.get(token);
    if (!session) return null;
    if (session.isExpired()) {
      this.sessions.delete(token);
      return null;
    }
    return session;
  }

  async findActiveByUserId(userId: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      s => s.userId === userId && s.isValid(),
    );
  }

  async revoke(sessionId: string): Promise<void> {
    for (const [token, session] of this.sessions.entries()) {
      if (session.id === sessionId) {
        session['revokedAt'] = new Date();
        this.sessions.set(token, session);
        break;
      }
    }
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    for (const [token, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        session['revokedAt'] = new Date();
        this.sessions.set(token, session);
      }
    }
  }

  async deleteExpired(): Promise<number> {
    let count = 0;
    for (const [token, session] of this.sessions.entries()) {
      if (session.isExpired()) {
        this.sessions.delete(token);
        count++;
      }
    }
    return count;
  }
}
