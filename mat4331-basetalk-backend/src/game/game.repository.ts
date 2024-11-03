import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Repository } from 'typeorm';
import { EmissionGameDto } from './dto/emission-game.dto';

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
  async upsertGame(emissionGameDto: EmissionGameDto): Promise<Game> {
    // find a game from the DB by crawling ID
    const game = await this.repository.findOne({
      where: { gameCid: emissionGameDto.gameCid },
    });

    // if the game exists, just update the information
    if (game) {
      return this.repository.save({ ...game, ...emissionGameDto });
    }
    // or else, create and save the information
    else {
      return this.repository.save(
        this.repository.create({ ...emissionGameDto }),
      );
    }
  }
}
