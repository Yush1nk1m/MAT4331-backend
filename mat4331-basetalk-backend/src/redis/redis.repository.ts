import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisRepository implements OnModuleDestroy {
  constructor(
    @Inject('RedisClient') private readonly redisClient: Redis,
    @Inject('RedisPub') private readonly pubClient: Redis,
    @Inject('RedisSub') private readonly subClient: Redis,
  ) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
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

  async publish(prefix: string, key: string, chat: string): Promise<void> {
    await this.pubClient.publish(`${prefix}:${key}`, chat);
  }

  async subscribe(prefix: string, key: string): Promise<void> {
    await this.subClient.subscribe(`${prefix}:${key}`);
  }

  async onChat(
    callback: (channel: string, chat: string) => void,
  ): Promise<void> {
    this.subClient.on('chat', (channel, chat) => {
      callback(channel, chat);
    });
  }
}
