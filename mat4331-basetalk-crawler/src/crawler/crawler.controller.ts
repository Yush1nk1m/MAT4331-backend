import { Controller, Logger, Post } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

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
}
