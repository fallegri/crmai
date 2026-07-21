import { Injectable } from '@nestjs/common';
import { CatalogCachePort } from '../../application/ports';

@Injectable()
export class RedisCatalogCacheAdapter implements CatalogCachePort {
  private store = new Map<string, { value: any; expiry: number }>();

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.store.delete(key);
      return null;
    }
    return entry.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
    this.store.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
  }

  async invalidate(pattern: string): Promise<void> {
    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.store.keys()) {
      if (regex.test(key)) {
        this.store.delete(key);
      }
    }
  }
}
