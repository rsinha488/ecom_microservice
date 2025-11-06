// src/infrastructure/redis/redis.module.ts

import { Module } from '@nestjs/common';
import RedisConfig from './redis.config';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from './redis.service';
import { RedisLockService } from './redis-lock.service';

@Module({
  imports: [ConfigModule],  
  providers: [
    {
      provide: 'REDIS_OPTIONS',
      useValue: RedisConfig(),
    },
    RedisService,
    RedisLockService,
  ],
  exports: [RedisService, RedisLockService],
})
export class RedisModule {}
