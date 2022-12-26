/* eslint-disable prettier/prettier */
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  cacheSet(key: string, value: string, ttl: number) {
    console.log('cacheSet...' + key + ':' + value);
    this.cacheManager.set(key, value, ttl);
  }
  async cacheGet(key: string): Promise<any> {
    console.log('cacheGet...' + key + ':');
    const v = await this.cacheManager.get(key);
    console.log(v);
    return v;
  }
}
