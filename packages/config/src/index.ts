function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  api: {
    port: parseInt(process.env.API_PORT || '3001', 10),
    prefix: '/api/v1',
  },
  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  redis: {
    url: requireEnv('REDIS_URL'),
  },
  database: {
    url: requireEnv('DATABASE_URL'),
  },
};
