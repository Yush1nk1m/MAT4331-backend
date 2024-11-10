import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EmissionGameDto } from './dto/emission-game.dto';
import { GameRepository } from './game.repository';
import { ClientProxy } from '@nestjs/microservices';
import { Game } from './game.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Events } from 'src/common/constants/event.constant';
import { CalculateAverageDto } from './dto/calculate-average.dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly gameRepository: GameRepository,
    @Inject('MainToCrawler')
    private readonly rmqClient: ClientProxy,
  ) {}

  /**
   * Events.GAME_UPDATED event handling service logic
   * @param emissionGameDto emitted updated game information
   */
  async updateCrawledGame(emissionGameDto: EmissionGameDto): Promise<void> {
    try {
      const game = await this.gameRepository.upsertGame(emissionGameDto);
      this.logger.debug('Upserted game', game);
    } catch (error) {
      this.logger.debug(
        `Error occurred while update crawled game: ${error.message}`,
      );
    }
  }

  /**
   * method for finding game with the specified id
   * @param gameId game's id
   * @returns found game
   */
  async findGameById(gameId: number): Promise<Game> {
    return this.gameRepository.findGameById(gameId);
  }

  /**
   * method for validating game if it exists
   * @param gameId game's id
   * @returns found game
   */
  async validateGameById(gameId: number): Promise<Game> {
    const game: Game = await this.gameRepository.findGameById(gameId);

    if (!game) {
      throw new NotFoundException(`Game with id: ${gameId} has not found`);
    }

    return game;
  }

  /**
   * method for predicting games' score not yet predicted
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async predictGameScore(): Promise<void> {
    // find games not yet predicted
    const games: Game[] = await this.gameRepository.findGamesNotPredicted();

    this.logger.debug(
      `found games not yet predicted: ${JSON.stringify(games)}`,
    );

    // send request to calculate average statistics for AI model prediction
    await Promise.all(
      games.map((game) => {
        // create DTO for request
        const calculateAverageDto: CalculateAverageDto = {
          gameId: game.gameCid,
        };

        // emit request to crawler service
        this.rmqClient.emit(Events.GAME_CACULATE_AVERAGE, calculateAverageDto);
      }),
    );
  }
}
