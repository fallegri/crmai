import { Inject, Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { User, UserStatus, RefreshToken } from '../../domain';
import {
  USER_REPOSITORY_PORT, UserRepositoryPort,
  SESSION_PORT, SessionPort,
  TOKEN_SERVICE_PORT, TokenServicePort,
  PASSWORD_HASHER_PORT, PasswordHasherPort,
  TokenPayload, TokenPair,
} from '../ports';
import { Session } from '../../domain';

@Injectable()
export class AuthUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepo: UserRepositoryPort,
    @Inject(SESSION_PORT) private readonly sessionPort: SessionPort,
    @Inject(TOKEN_SERVICE_PORT) private readonly tokenService: TokenServicePort,
    @Inject(PASSWORD_HASHER_PORT) private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async register(dto: { email: string; password: string; firstName: string; lastName: string }): Promise<User> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await this.passwordHasher.hash(dto.password);
    return this.userRepo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
  }

  async login(email: string, password: string, ipAddress?: string, userAgent?: string): Promise<{ user: User; tokens: TokenPair }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isActive()) {
      throw new UnauthorizedException('Account is inactive or blocked');
    }
    const isValid = await this.passwordHasher.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const permissions = await this.userRepo.findPermissionsByUserId(user.id);
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      permissions: permissions.map(p => `${p.module}:${p.action}`),
    };
    const tokens = await this.tokenService.generateTokenPair(payload);

    const session = new Session(
      crypto.randomUUID(),
      user.id,
      tokens.accessToken,
      ipAddress || null,
      userAgent || null,
      new Date(Date.now() + 15 * 60 * 1000),
      new Date(),
      null,
    );
    await this.sessionPort.create(session);

    const refreshToken = new RefreshToken(
      crypto.randomUUID(),
      user.id,
      tokens.refreshToken,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      new Date(),
      null,
    );

    return { user, tokens };
  }

  async refreshToken(refreshToken: string): Promise<TokenPair> {
    const payload = await this.tokenService.verifyRefreshToken(refreshToken);
    const user = await this.userRepo.findById(payload.sub);
    if (!user || !user.isActive()) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const permissions = await this.userRepo.findPermissionsByUserId(user.id);
    const newPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles.map(r => r.name),
      permissions: permissions.map(p => `${p.module}:${p.action}`),
    };
    return this.tokenService.generateTokenPair(newPayload);
  }

  async logout(accessToken: string): Promise<void> {
    const session = await this.sessionPort.findByToken(accessToken);
    if (session) {
      await this.sessionPort.revoke(session.id);
    }
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async enable2FA(userId: string): Promise<{ secret: string }> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const secret = crypto.randomUUID().replace(/-/g, '').substring(0, 16);
    user.enable2FA(secret);
    await this.userRepo.update(userId, {});
    return { secret };
  }

  async disable2FA(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    user.disable2FA();
    await this.userRepo.update(userId, {});
  }

  async forgotPassword(email: string): Promise<{ resetToken: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      return { resetToken: '' };
    }
    const resetToken = await this.tokenService.generateResetToken(user.id);
    return { resetToken };
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const userId = await this.tokenService.verifyResetToken(token);
    const passwordHash = await this.passwordHasher.hash(newPassword);
    await this.userRepo.update(userId, {});
    await this.sessionPort.revokeAllByUserId(userId);
  }
}
