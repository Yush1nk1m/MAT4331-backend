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

  /**
   * method for getting stored refresh token from Redis
   * @param memberId member's id, sub field of JWT payload
   * @returns the found refresh token
   */
  async getRefreshToken(memberId: number): Promise<string> {
    // get and return the stored refresh token
    return this.redisRepository.get('refresh_token', String(memberId));
  }

  async deleteRefreshToken(memberId: number): Promise<void> {
    // delete the member's refresh token
    return this.redisRepository.delete('refresh_token', String(memberId));
  }
}
