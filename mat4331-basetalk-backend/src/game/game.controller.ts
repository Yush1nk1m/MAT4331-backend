import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  // rmq test method
  @EventPattern('data')
  async handleData(data: any) {
    this.logger.debug('Received data:', data);
  }
}
