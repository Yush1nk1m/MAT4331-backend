import { Controller, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { EventPattern } from '@nestjs/microservices';
import { EmissionGameDto } from './dto/emission-game.dto';
import { Events } from 'src/common/constants/event.constant';

@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  /**
   * handle Events.GAME_UPDATED event
   * @param emissionGameDto emitted updated game information
   */
  @EventPattern(Events.GAME_UPDATED)
  async handleGameUpdated(emissionGameDto: EmissionGameDto): Promise<void> {
    return this.gameService.updateCrawledGame(emissionGameDto);
  }
}
