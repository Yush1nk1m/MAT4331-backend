import { Injectable, Logger } from '@nestjs/common';
import { BatStatsRepository } from '../repository/bat-stats.repository';
import { PitchStatsRepository } from '../repository/pitch-stats.repository';
import { GamesRepository } from '../repository/games.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { GameStatsDto } from '../common/dto/game-stats.dto';
import { CreateGamesDto } from '../common/dto/create-games.dto';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly batStatsRepository: BatStatsRepository,
    private readonly pitchStatsRepository: PitchStatsRepository,
    private readonly gamesRepository: GamesRepository,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  /**
   * save basic game information and its statistics to MongoDB transactionally
   * @param gameStatsDto game id, game information, teams' statistics
   */
  async loadGameStats(gameStatsDto: GameStatsDto): Promise<void> {
    // destruct DTO
    const { gameId, gameInfo, teamStats } = gameStatsDto;

    // create session for the transaction
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      let game;
      // if it has teams' statistics (finished game)
      if (teamStats) {
        // create bat statistics
        const awayBatStats = await this.batStatsRepository.createByBatInfo(
          teamStats.bat_stats_away,
        );
        const homeBatStats = await this.batStatsRepository.createByBatInfo(
          teamStats.bat_stats_home,
        );

        // create pitch statistics
        const awayPitchStats =
          await this.pitchStatsRepository.createByPitchInfo(
            teamStats.pitch_stats_away,
          );
        const homePitchStats =
          await this.pitchStatsRepository.createByPitchInfo(
            teamStats.pitch_stats_home,
          );

        // create CreateGamesDto
        const createGamesDto: CreateGamesDto = {
          game_id: gameId,
          ...gameInfo,
          away_score: teamStats.away_score,
          home_score: teamStats.home_score,
          bat_stats_away: awayBatStats._id as mongoose.Types.ObjectId,
          bat_stats_home: homeBatStats._id as mongoose.Types.ObjectId,
          pitch_stats_away: awayPitchStats._id as mongoose.Types.ObjectId,
          pitch_stats_home: homePitchStats._id as mongoose.Types.ObjectId,
        };
        game = await this.gamesRepository.createGames(createGamesDto);
      } else {
        const createGamesDto = {
          game_id: gameId,
          ...gameInfo,
        };
        game = await this.gamesRepository.createGames(createGamesDto);
      }
      // log
      this.logger.debug('A game has been saved.', game);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
