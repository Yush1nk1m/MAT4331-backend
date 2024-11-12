import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { GameService } from './game.service';
import { EventPattern } from '@nestjs/microservices';
import { EmissionGameUpdatedDto } from './dto/emission-game-updated.dto';
import { Events } from 'src/common/constants/event.constant';
import { EmissionSavePredictionDto } from './dto/emission-save-prediction.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SearchGameDto } from './dto/search-game.dto';
import { GameDto } from './dto/game.dto';
import { Game } from './game.entity';
import { plainToInstance } from 'class-transformer';

@ApiTags('Game')
@ApiBadRequestResponse({
  description: '요청 형식이 유효하지 않다.',
})
@ApiUnauthorizedResponse({
  description: '회원의 권한이 없다.',
})
@ApiInternalServerErrorResponse({
  description: '예기치 못한 서버 오류가 발생한다.',
})
@Controller('games')
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

  /**
   * handle Events.GAME_SAVE_PREDICTION event
   * @param emissionSavePredictionDto game's crawling id, predicted away score, predicted home score
   */
  @EventPattern(Events.GAME_SAVE_PREDICTION)
  async handleSavePrediction(
    emissionSavePredictionDto: EmissionSavePredictionDto,
  ): Promise<void> {
    this.logger.debug(
      `Passed prediction: ${JSON.stringify(emissionSavePredictionDto)}`,
    );
  }

  @ApiOperation({
    summary: '[G-01] 특정 날짜 경기 정보 조회',
    description: '특정 날짜의 KBO 경기들을 조회한다.',
  })
  @ApiOkResponse({
    description: '경기 정보 조회에 성공한다.',
    type: [GameDto],
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async getGames(@Query() searchGameDto: SearchGameDto): Promise<GameDto[]> {
    // destruct DTO and create the date object
    const { year, month, day } = searchGameDto;
    const date: Date = new Date(year, month - 1, day);

    // find games
    const games: Game[] = await this.gameService.findGamesByDate(date);

    // plain to DTO instances
    const gameList: GameDto[] = games.map((game) => {
      return plainToInstance(GameDto, game, { excludeExtraneousValues: true });
    });

    // return DTO
    return gameList;
  }
}
