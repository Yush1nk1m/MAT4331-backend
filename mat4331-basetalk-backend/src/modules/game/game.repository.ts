import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Not, Repository } from 'typeorm';
import { EmissionGameUpdatedDto } from './dto/emission-game-updated.dto';
import { GameStatus } from '../../common/types/game-status.enum';

@Injectable()
export class GameRepository {
  constructor(
    @InjectRepository(Game)
    private readonly repository: Repository<Game>,
  ) {}

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
      predictedAwayScore: null,
      gameStatus: Not(GameStatus.CANCELED),
    });
  }
}
