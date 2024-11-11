import { Controller, Logger } from '@nestjs/common';
import { GameService } from './game.service';
import { EventPattern } from '@nestjs/microservices';
import { EmissionGameUpdatedDto } from './dto/emission-game-updated.dto';
import { Events } from 'src/common/constants/event.constant';
import { EmissionSavePredictionDto } from './dto/emission-save-prediction.dto';

@Controller('game')
export class GameController {
  private readonly logger = new Logger(GameController.name);

  constructor(private readonly gameService: GameService) {}

  /**
   * handle Events.GAME_UPDATED event
   * @param emissionGameDto emitted updated game information
   */
  @EventPattern(Events.GAME_UPDATED)
  async handleGameUpdated(
    emissionGameUpdatedDto: EmissionGameUpdatedDto,
  ): Promise<void> {
    return this.gameService.updateCrawledGame(emissionGameUpdatedDto);
  }

  @EventPattern(Events.GAME_SAVE_PREDICTION)
  async handleSavePrediction(
    emissionSavePredictionDto: EmissionSavePredictionDto,
  ): Promise<void> {
    this.logger.debug(
      `Passed prediction: ${JSON.stringify(emissionSavePredictionDto)}`,
    );
  }
}
