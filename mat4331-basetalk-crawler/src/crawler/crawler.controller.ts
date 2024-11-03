import { Controller, Logger, Post } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { EventPattern } from '@nestjs/microservices';
import { Events } from 'src/common/constants/event.constant';

@Controller('crawler/v1')
export class CrawlerController {
  private readonly logger = new Logger(CrawlerController.name);

  constructor(private readonly crawlerService: CrawlerService) {}

  /**
   * on-demand API for loading annual data
   * it needs to be called when the application is initiated
   */
  @Post('games/load')
  async loadAnnualData(): Promise<void> {
    await this.crawlerService.loadAnnualGames(new Date().getFullYear());
  }

  /**
   * event handler for processing the Events.GAME_RELOAD notification from main service
   * it executes the logic crawling annual games and update the changed information
   */
  @EventPattern(Events.GAME_RELOAD)
  async handleReloadGame(): Promise<void> {
    this.logger.debug(
      'Crawling service has accept the notification of reloading game',
    );

    await this.crawlerService.loadAnnualGames(new Date().getFullYear());
  }
}
