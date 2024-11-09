import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  private logger: Logger = new Logger(RedisRepository.name);

  constructor(
    @Inject('RedisClient') private readonly redisClient: Redis,
    @Inject('RedisPub') private readonly pubClient: Redis,
    @Inject('RedisSub') private readonly subClient: Redis,
  ) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
    this.pubClient.disconnect();
    this.subClient.disconnect();
  }

  async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(`${prefix}:${key}`);
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    await this.redisClient.set(`${prefix}:${value}`, value);
  }

  async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
  }

  // Pub/Sub

  async publish(channel: string, message: string): Promise<void> {
    await this.pubClient.publish(channel, message);
  }

  async subscribe(channel: string): Promise<void> {
    await this.subClient.subscribe(channel);
  }

  async onChat(
    callback: (channel: string, chat: string) => void,
  ): Promise<void> {
    this.subClient.on('chat', (channel, chat) => {
      callback(channel, chat);
    });
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subClient.unsubscribe(channel);
  }
}
