import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { Events } from 'src/common/constants/event.constant';
import { EmissionGameDto } from './dto/emission-game.dto';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  // rmq test method
  @EventPattern('data')
  async handleData(data: any) {
    this.logger.debug('Received data:', data);
  }

  /**
   * event handler for processing crawler service's updated datum
   * @param emissionGameDto emitted updated game information
   */
  @EventPattern(Events.GAME_UPDATED)
  async handleUpdatedGame(emissionGameDto: EmissionGameDto): Promise<void> {
    this.logger.debug('Main service has accepted the updated game information');
    return this.gameService.updateCrawledGame(emissionGameDto);
  }
}
