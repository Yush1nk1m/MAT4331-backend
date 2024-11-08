import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EmissionGameDto } from './dto/emission-game.dto';
import { GameRepository } from './game.repository';
import { ClientProxy } from '@nestjs/microservices';
import { Game } from './game.entity';

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
}
