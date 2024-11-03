import { Inject, Injectable, Logger } from '@nestjs/common';
import { EmissionGameDto } from './dto/emission-game.dto';
import { GameRepository } from './game.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { Events } from 'src/common/constants/event.constant';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly gameRepository: GameRepository,
    @Inject('MainToCrawler')
    private readonly client: ClientProxy,
  ) {}

  /**
   * Events.GAME_UPDATED event handling service logic
   * @param emissionGameDto emitted updated game information
   */
  async updateCrawledGame(emissionGameDto: EmissionGameDto): Promise<void> {
    const game = await this.gameRepository.upsertGame(emissionGameDto);
    this.logger.debug('Upserted game', game);
  }

  /**
   * Event emission method for Events.GAME_RELOAD
   * reload annual games' information and get the updated information through updateCrawledGame() above
   * it runs once at a day and renew the data
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async notifyGameReload(): Promise<void> {
    this.logger.debug(
      'Main service has notified crawler service to reload game information',
    );
    this.client.emit(Events.GAME_RELOAD, {});
  }
}
