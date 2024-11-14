import { Injectable, Logger } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  private readonly logger: Logger = new Logger(RedisService.name);

  constructor(private readonly redisRepository: RedisRepository) {}

  /**
   * method for storing refresh token to Redis
   * @param memberId member's id
   * @param refreshToken generated refresh token
   * @param expiry exiration time
   */
  async setRefreshToken(
    memberId: number,
    refreshToken: string,
    expiry: number,
  ): Promise<void> {
    // store the refresh token to Redis
    await this.redisRepository.setWithExpiry(
      'refresh_token',
      String(memberId),
      refreshToken,
      expiry,
    );
  }

  /**
   * method for getting stored refresh token from Redis
   * @param memberId member's id
   * @returns the found refresh token
   */
  async getRefreshToken(memberId: number): Promise<string | null> {
    // get and return the stored refresh token
    return this.redisRepository.get('refresh_token', String(memberId));
  }

  /**
   * method for deleting stored refresh token from Redis
   * @param memberId member's id
   */
  async deleteRefreshToken(memberId: number): Promise<void> {
    // delete the member's refresh token
    return this.redisRepository.delete('refresh_token', String(memberId));
  }

  /**
   * method for storing grant code to Redis
   * @param memberId member's id
   * @param code grant code
   */
  async setGrantCode(memberId: number, code: string): Promise<void> {
    // store the grant code to Redis
    await this.redisRepository.setWithExpiry(
      'grant_code',
      String(memberId),
      code,
      60, // with 60 seconds of life
    );
  }

  /**
   * method for getting stored grant code
   * @param memberId member's id
   * @returns found grant code
   */
  async getGrantCode(memberId: number): Promise<string | null> {
    // get and return grant code
    return this.redisRepository.get('grant_code', String(memberId));
  }

  /**
   * method for deleting stored grant code
   * @param memberId member's id
   */
  async deleteGrantCode(memberId: number): Promise<void> {
    // delete the grant code from Redis
    await this.redisRepository.delete('grant_code', String(memberId));
  }
}
