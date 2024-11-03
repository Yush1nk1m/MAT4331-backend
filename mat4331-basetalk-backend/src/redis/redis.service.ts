import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  /**
   * method for storing refresh token in Redis
   * @param memberId member's id
   * @param refreshToken generated refresh token
   * @param expiry exiration time
   */
  async setRefreshToken(
    memberId: number,
    refreshToken: string,
    expiry: number,
  ): Promise<void> {
    await this.redisRepository.setWithExpiry(
      'refresh_token',
      String(memberId),
      refreshToken,
      expiry,
    );
  }
}
