import { Session } from '../../domain';

export const SESSION_PORT = 'SessionPort';

export interface SessionPort {
  create(session: Session): Promise<void>;
  findByToken(token: string): Promise<Session | null>;
  findActiveByUserId(userId: string): Promise<Session[]>;
  revoke(sessionId: string): Promise<void>;
  revokeAllByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;
}
