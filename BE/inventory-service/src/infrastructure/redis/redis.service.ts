import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  private readonly publisher: Redis;
  private readonly subscriber: Redis;

  constructor(
    @Inject('REDIS_OPTIONS') private readonly options: RedisOptions,
  ) {
    this.publisher = new Redis({
      ...this.options,
      retryStrategy: times => Math.min(times * 50, 2000),
    });

    this.subscriber = new Redis({
      ...this.options,
      retryStrategy: times => Math.min(times * 50, 2000),
    });

    this.publisher.on('connect', () =>
      this.logger.log('✅ Redis Publisher connected'),
    );
    this.subscriber.on('connect', () =>
      this.logger.log('✅ Redis Subscriber connected'),
    );

    this.publisher.on('error', err => this.logger.error('❌ Publisher error', err));
    this.subscriber.on('error', err => this.logger.error('❌ Subscriber error', err));
  }

  /** Publish client */
  getClient(): Redis {
    return this.publisher;
  }

  /** Subscriber client for pub/sub */
  getSubscriber(): Redis {
    return this.subscriber;
  }

  async onModuleDestroy() {
    this.logger.log('⚡ Closing Redis connections...');
    await this.publisher.quit();
    await this.subscriber.quit();
  }
}
