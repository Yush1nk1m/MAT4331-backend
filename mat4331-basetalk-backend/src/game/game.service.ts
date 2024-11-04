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
}
