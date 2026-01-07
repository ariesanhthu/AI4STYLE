import { Cache } from '@nestjs/cache-manager';
import { ICacheService } from '@/shared/interfaces';
export declare class NestCacheService implements ICacheService {
    private cacheManager;
    constructor(cacheManager: Cache);
    get<T>(key: string): Promise<T | undefined>;
    set(key: string, value: unknown, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
}
