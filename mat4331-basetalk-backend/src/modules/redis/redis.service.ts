import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  // track subscription count and deallocate Redis resource
  private readonly subscriptionMap: Map<string, number>; // <channel, subscription count>
  // save callback functions per channel to register onChat event handler
  private readonly callbackMap: Map<string, (chat: string) => void>; // <channel, callback function>

  constructor(private readonly redisRepository: RedisRepository) {
    this.subscriptionMap = new Map<string, number>();
    this.callbackMap = new Map<string, (chat: string) => void>();

    // register onChat only once
    this.redisRepository.onChat((channel, chat) => {
      if (this.callbackMap.has(channel)) {
        const callback = this.callbackMap.get(channel);
        callback(chat);
      }
    });
  }

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

  /**
   * method for publishing chat to the specified channel
   * @param channel Redis channel (ex: 'chatroom:123')
   * @param chat chat to send
   */
  async publishChat(channel: string, chat: string): Promise<void> {
    await this.redisRepository.publish(channel, chat);
  }

  /**
   * method for subscribe specific channel, and set the callback to process received chat
   * @param channel Redis channel
   * @param callback callback function for processing chat
   */
  async subscribeToChannel(
    channel: string,
    callback: (chat: string) => void,
  ): Promise<void> {
    // if no one subscribes the chatroom, subscribe it
    if ((this.subscriptionMap.get(channel) || 0) === 0) {
      await this.redisRepository.subscribe(channel);
      this.callbackMap.set(channel, callback);
    }

    // and increase subscribe count by 1
    this.subscriptionMap.set(
      channel,
      (this.subscriptionMap.get(channel) || 0) + 1,
    );
  }

  /**
   * method for unsubscribing specified Redis channel
   * @param channel Redis channel
   */
  async unsubscribeFromChannel(channel: string): Promise<void> {
    const subscriptionCount: number = this.subscriptionMap.get(channel) || 0;

    if (subscriptionCount === 1) {
      await this.redisRepository.unsubscribe(channel);
      this.subscriptionMap.delete(channel);
    } else if (subscriptionCount > 1) {
      this.subscriptionMap.set(channel, subscriptionCount - 1);
    }
  }
}
