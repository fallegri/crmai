export const PASSWORD_HASHER_PORT = 'PasswordHasherPort';

export interface PasswordHasherPort {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}
