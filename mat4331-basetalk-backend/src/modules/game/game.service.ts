import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EmissionGameUpdatedDto } from './dto/emission-game-updated.dto';
import { GameRepository } from './game.repository';
import { ClientProxy } from '@nestjs/microservices';
import { Game } from './game.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Events } from 'src/common/constants/event.constant';
import { GameCidDto } from './dto/game-cid.dto';
import { CreateGameDto } from './dto/create-game.dto';
import { GameSavePredictionDto } from './dto/game-save-prediction.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly gameRepository: GameRepository,
    @Inject('MainToCrawler')
    private readonly rmqClient: ClientProxy,
  ) {}

  /**
   * test method
   */
  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    return this.gameRepository.createGame(createGameDto);
  }

  /**
   * Events.GAME_UPDATED event handling service logic
   * @param emissionGameDto emitted updated game information
   */
  async updateCrawledGame(
    emissionGameUpdatedDto: EmissionGameUpdatedDto,
  ): Promise<void> {
    try {
      const game = await this.gameRepository.upsertGame(emissionGameUpdatedDto);
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
   * this method has high cost if there's no AI model integrated, so DON'T SCHEDULE BEFORE AI MODEL IS INTEGRATED
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async predictGameScore(): Promise<void> {
    // find games not yet predicted
    const games: Game[] = await this.gameRepository.findGamesNotPredicted();

    // send request to aggregate statistics for AI model prediction
    await Promise.all(
      games.map((game) => {
        // create DTO for request
        const gameCidDto: GameCidDto = {
          gameId: game.gameCid,
        };

        // emit request to crawler service
        this.rmqClient.emit(Events.GAME_AGGREGATE_STATISTICS, gameCidDto);
      }),
    );
  }

  /**
   * method for finding games of the specified date
   * @param date date
   * @returns found Games
   */
  async findGamesByDate(date: Date): Promise<Game[]> {
    return this.gameRepository.findGamesByDate(date);
  }

  /**
   * method for saving predicted game scores
   * @param gameSavePredictionDto game's cid,
   */
  @Transactional()
  async savePredictedScores(
    gameSavePredictionDto: GameSavePredictionDto,
  ): Promise<void> {
    const { game_id, predicted_away_score, predicted_home_score } =
      gameSavePredictionDto;

    await this.gameRepository.updatePredictedScores(
      game_id,
      predicted_away_score,
      predicted_home_score,
    );
  }
}
