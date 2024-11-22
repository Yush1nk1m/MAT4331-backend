import {
  Body,
  Controller,
  HttpStatus,
  Inject,
  Logger,
  Post,
} from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { GameService } from './game.service';
import { Events } from 'src/common/constants/event.constant';
import { GameCidDto } from './dto/game-cid.dto';
import { EmissionGameStatisticsDto } from './dto/emmision-game-statistics.dto';

@Controller('v1/game')
export class GameController {
  private readonly logger = new Logger(GameController.name);
  constructor(
    @Inject('CrawlerToMain')
    private readonly rmqCrawlerToMainClient: ClientProxy,
    private readonly gameService: GameService,
    @Inject('CrawlerToAi')
    private readonly rmqCrawlerToAiClient: ClientProxy,
  ) {}

  // rmq test method
  @Post()
  async sendData(@Body() data: any) {
    this.logger.debug('Producer received data:', data);

    data.date = new Date();
    this.rmqCrawlerToMainClient.emit('data', data);

    return {
      code: HttpStatus.ACCEPTED,
    };
  }

  @EventPattern(Events.GAME_AGGREGATE_STATISTICS)
  async handleGameCalculateAverage(gameCidDto: GameCidDto): Promise<void> {
    this.logger.debug(
      `Accept Events.GAME_AGGREGATE_STATISTICS gameId: ${gameCidDto.gameId}`,
    );

    // get the recent N games' statistics
    const emissionGameStatisticsDto: EmissionGameStatisticsDto =
      await this.gameService.getAverageStats(gameCidDto);

    // emit event to the AI service
    this.rmqCrawlerToAiClient.emit(
      Events.GAME_PREDICT_SCORE,
      emissionGameStatisticsDto,
    );
  }
}
