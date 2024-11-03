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
  async upsertGames(createGamesDto: CreateGamesDto): Promise<Games> {
    return this.model.findOneAndUpdate(
      { game_id: createGamesDto.game_id }, // filter
      { ...createGamesDto }, // target document
      {
        new: true, // return the updated document
        upsert: true, // create the document if it doesn't exist
      },
    );
  }

  /**
   * method for finding Games type document by its game_id
   * @param game_id game id of the game
   * @returns single Games document
   */
  async findGameByGameId(game_id: string): Promise<Games> {
    return this.model.findOne({ game_id }).exec();
  }
}
