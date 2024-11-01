import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Games } from '../schemas/games.schema';
import { CreateGamesDto } from '../common/dto/create-games.dto';

@Injectable()
export class GamesRepository {
  constructor(
    @InjectModel(Games.name)
    private readonly model: Model<Games>,
  ) {}

  /**
   * method for storing Games type document
   * @param createGamesDto total game information
   * @returns saved Games document
   */
  async createGames(createGamesDto: CreateGamesDto): Promise<Games> {
    const game = new this.model({
      ...createGamesDto,
    });
    return game.save();
  }
}
