import { OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
export declare class RedisService implements OnModuleDestroy {
    client: Redis;
    constructor();
    setLock(key: string, ttl?: number): Promise<"OK">;
    releaseLock(key: string): Promise<number>;
    quit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
