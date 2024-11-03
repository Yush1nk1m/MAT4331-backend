import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);
  constructor(
    @Inject('CrawlerToMain')
    private readonly client: ClientProxy,
  ) {}

  // rmq test method
  @Post()
  async sendData(@Body() data: any) {
    this.logger.debug('Producer received data:', data);

    data.date = new Date();
    this.client.emit('data', data);

    return {
      code: HttpStatus.ACCEPTED,
    };
  }
}
