import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

export class RedisIoAdapter extends IoAdapter {
  private logger: Logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:6379`,
    });
    const subClient = pubClient.duplicate();

    try {
      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.logger.debug(`Redis PubClient isOpen: ${pubClient.isOpen}`);
      this.logger.debug(`Redis SubClient isOpen: ${subClient.isOpen}`);
    } catch (error) {
      this.logger.debug('Error occurred while connecting redis broker');
      throw error;
    }

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
