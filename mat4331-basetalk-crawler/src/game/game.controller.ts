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
import { CalculateAverageDto } from './dto/calculate-average.dto';

@Controller('v1/game')
export class GameController {
  private readonly logger = new Logger(GameController.name);
  constructor(
    @Inject('CrawlerToMain')
    private readonly client: ClientProxy,
    private readonly gameService: GameService,
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

  @EventPattern(Events.GAME_CACULATE_AVERAGE)
  async handleGameCalculateAverage(
    calculateAverageDto: CalculateAverageDto,
  ): Promise<void> {
    this.logger.debug(
      `Accept Events.GAME_CALCULATE_AVERAGE gameId: ${calculateAverageDto.gameId}`,
    );

    return this.gameService.getAverageStats(calculateAverageDto);
  }
}
