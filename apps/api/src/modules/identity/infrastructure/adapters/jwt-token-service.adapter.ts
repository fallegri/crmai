import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort, TokenPayload, TokenPair } from '../../application/ports';

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}

  async generateTokenPair(payload: TokenPayload): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
        expiresIn: '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async generateResetToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId }, {
      secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
      expiresIn: '1h',
    });
  }

  async verifyResetToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
      });
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}
