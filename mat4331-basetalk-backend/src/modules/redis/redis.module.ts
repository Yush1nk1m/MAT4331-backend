import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisRepository } from './redis.repository';
import {
  RedisClientFactory,
  RedisPubFactory,
  RedisSubFactory,
} from '../../config/redis-client.factory';

@Module({
  providers: [
    RedisClientFactory,
    RedisPubFactory,
    RedisSubFactory,
    RedisService,
    RedisRepository,
  ],
  exports: [RedisService],
})
export class RedisModule {}
