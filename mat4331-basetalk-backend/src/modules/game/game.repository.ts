import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Between, IsNull, Not, Repository } from 'typeorm';
import { EmissionGameUpdatedDto } from './dto/emission-game-updated.dto';
import { GameStatus } from '../../common/types/game-status.enum';
import { CreateGameDto } from './dto/create-game.dto';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
  ) {}

  /**
   * test method
   */
  async createGame(createGameDto: CreateGameDto): Promise<Game> {
    return this.repository.save(
      this.repository.create({
        ...createGameDto,
        gameDate: new Date(createGameDto.gameDate),
      }),
    );
  }

  /**
   * upsert emitted game information
   * @param emissionGameDto game information emitted from crawler service
   * @returns upserted game
   */
  async upsertGame(
    emissionGameUpdatedDto: EmissionGameUpdatedDto,
  ): Promise<Game> {
    // find a game from the DB by crawling ID
    const game = await this.repository.findOne({
      where: { gameCid: emissionGameUpdatedDto.gameCid },
    });

    // if the game exists, just update the information
    if (game) {
      return this.repository.save({ ...game, ...emissionGameUpdatedDto });
    }
    // or else, create and save the information
    else {
      return this.repository.save(
        this.repository.create({ ...emissionGameUpdatedDto }),
      );
    }
  }

  /**
   * method for finding game by its id
   * @param gameId game's id
   * @returns found game
   */
  async findGameById(gameId: number): Promise<Game> {
    return this.repository.findOneBy({ id: gameId });
  }

  /**
   * method for finding games not yet predicted and not canceled
   * @returns list of Games
   */
  async findGamesNotPredicted(): Promise<Game[]> {
    return this.repository.findBy({
      predictedAwayScore: IsNull(),
      gameStatus: Not(GameStatus.CANCELED),
    });
  }

  /**
   * method for finding games of the specified date
   * @param gameDate Game's date
   * @returns found Games
   */
  async findGamesByDate(gameDate: Date): Promise<Game[]> {
    const startOfDay: Date = new Date(new Date(gameDate).setHours(0, 0, 0, 0));
    const endOfDay: Date = new Date(
      new Date(gameDate).setHours(23, 59, 59, 999),
    );

    return this.repository.findBy({ gameDate: Between(startOfDay, endOfDay) });
  }

  /**
   * method for updating game's prediction
   * @param gameCid game's crawling id
   * @param predictedAwayScore predicted score of the away team
   * @param predictedHomeScore predicted score of the home team
   */
  async updatePredictedScores(
    gameCid: string,
    predictedAwayScore: number,
    predictedHomeScore: number,
  ): Promise<void> {
    await this.repository.update(
      {
        gameCid,
      },
      {
        predictedAwayScore,
        predictedHomeScore,
      },
    );
  }
}
