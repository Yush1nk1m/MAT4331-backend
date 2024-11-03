import { Inject, Injectable, Logger } from '@nestjs/common';
import { BatStatsRepository } from '../repository/bat-stats.repository';
import { PitchStatsRepository } from '../repository/pitch-stats.repository';
import { GamesRepository } from '../repository/games.repository';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';
import { GameStatsDto } from '../common/dto/game-stats.dto';
import { CreateGamesDto } from '../common/dto/create-games.dto';
import { GameStatus } from 'src/common/types/game-status.enum';
import { ClientProxy } from '@nestjs/microservices';
import { Games } from 'src/schemas/games.schema';
import { EmissionGameDto } from './dto/emission-game.dto';
import { Events } from 'src/common/constants/event.constant';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly batStatsRepository: BatStatsRepository,
    private readonly pitchStatsRepository: PitchStatsRepository,
    private readonly gamesRepository: GamesRepository,
    @InjectConnection()
    private readonly connection: Connection,
    @Inject('CrawlerToMain')
    private readonly client: ClientProxy,
  ) {}

  /**
   * upsert basic game information and its statistics to MongoDB transactionally
   * and emit this information to the main service through the message queue
   * @param gameStatsDto game id, game information, teams' statistics
   */
  async loadGameStats(gameStatsDto: GameStatsDto): Promise<void> {
    // destruct DTO
    const { gameId, gameInfo, teamStats } = gameStatsDto;

    // check if the game is already stored to the DB
    const game = await this.gamesRepository.findGameByGameId(gameId);
    // if the game is already exists and its status is not SCHEDULED, it must not be changed
    if (game && game.game_status !== GameStatus.SCHEDULED) {
      // so return the method instantly
      return;
    }

    // create session for the transaction
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      let updatedGame: Games;
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

        // create CreateGamesDto with whole information
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

        // upsert game information
        updatedGame = await this.gamesRepository.upsertGames(createGamesDto);
      } else {
        // create CreateGamesDto with minimal information
        const createGamesDto = {
          game_id: gameId,
          ...gameInfo,
        };

        // upsert game information
        updatedGame = await this.gamesRepository.upsertGames(createGamesDto);
      }

      // create EmissionGameDto with the essential game information to the main service
      const emissionGameDto: EmissionGameDto = {
        gameCid: updatedGame.game_id,
        awayTeam: updatedGame.away_team,
        homeTeam: updatedGame.home_team,
        awayScore: updatedGame.away_score,
        homeScore: updatedGame.home_score,
        gameStatus: updatedGame.game_status,
        gameDate: updatedGame.game_date,
      };

      // emit the the data
      this.client.emit(Events.GAME_UPDATED, emissionGameDto);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
