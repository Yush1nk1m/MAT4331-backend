import { FactoryProvider } from '@nestjs/common';
import Redis from 'ioredis';

export const RedisClientFactory: FactoryProvider<Redis> = {
  provide: 'RedisClient',
  useFactory: () => {
    const redisInstance = new Redis({
      host: 'localhost',
      port: 6379,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};

export const RedisPubFactory: FactoryProvider<Redis> = {
  provide: 'RedisPub',
  useFactory: () => {
    const redisInstance = new Redis({
      host: 'localhost',
      port: 6379,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};

export const RedisSubFactory: FactoryProvider<Redis> = {
  provide: 'RedisSub',
  useFactory: () => {
    const redisInstance = new Redis({
      host: 'localhost',
      port: 6379,
    });

    redisInstance.on('error', (e) => {
      throw new Error(`Redis connection failed: ${e}`);
    });

    return redisInstance;
  },
  inject: [],
};
