export interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export const TOKEN_SERVICE_PORT = 'TokenServicePort';

export interface TokenServicePort {
  generateTokenPair(payload: TokenPayload): Promise<TokenPair>;
  verifyAccessToken(token: string): Promise<TokenPayload>;
  verifyRefreshToken(token: string): Promise<TokenPayload>;
  generateResetToken(userId: string): Promise<string>;
  verifyResetToken(token: string): Promise<string>;
}
