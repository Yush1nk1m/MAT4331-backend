import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GameInfo } from '../common/types/game-info.type';
import { KBOTeam } from '../common/types/KBO-team.enum';
import { GameStatus } from '../common/types/game-status.enum';
import { isKBOTeam } from '../common/utils/is-KBO-team.util';
import { TeamStats } from '../common/types/team-stats.type';
import { BatInfo } from '../common/types/bat-info.type';
import { mapValuesToObject } from '../common/utils/column-mapper';
import {
  batColumnMap,
  pitchColumnMap,
} from '../common/utils/stats-column-map.util';
import { PitchInfo } from '../common/types/pitch-info.type';
import { GameStatsDto } from '../common/dto/game-stats.dto';
import { GameService } from '../game/game.service';
import { plainToClass } from 'class-transformer';
import { GamesRepository } from 'src/repository/games.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CrawlerService {
  private logger = new Logger(CrawlerService.name);

  constructor(
    private readonly gameService: GameService,
    private readonly gamesRepository: GamesRepository,
  ) {}

  /**
   * method for getting STATIZ game schedule URL
   * @param year target year
   * @param month target month
   * @returns game schedule URL for the specified year, month
   */
  getScheduleUrl(year: number, month: number): string {
    return `https://statiz.sporki.com/schedule/?year=${year}&month=${month}`;
  }

  /**
   * method for getting STATIZ boxscore URL
   * @param gameId target game id
   * @returns boxscore URL for the specified game id
   */
  getBoxscoreUrl(gameId: string): string {
    return `https://statiz.sporki.com/schedule/?m=boxscore&s_no=${gameId}`;
  }

  /**
   * method for getting cheerio root data of the specified page
   * @param url URL which is wanted to be fetched
   * @returns parsed cheerio root data
   */
  async parseRoot(url: string): Promise<cheerio.Root> {
    const { data } = await axios.get<string>(url);
    return cheerio.load(data);
  }

  /**
   * method for extract monthly game ids and their scheduled date
   * @param year target year
   * @param month target month
   * @returns specified year and month's game ids and their scheduled date(mapped to Map<string, Date>)
   */
  async getMonthlyGameIds(
    year: number,
    month: number,
  ): Promise<Map<string, GameInfo>> {
    // create the cheerio root
    const url = this.getScheduleUrl(year, month);
    const $ = await this.parseRoot(url);

    // find game ids and map with day
    const gameInfoMap = new Map<string, GameInfo>();
    // for each td(each day) in calendar
    $('td:has(div.games)').each((tdIndex, td) => {
      // find a element mapping game id in href
      $(td)
        .find('a')
        .each((aIndex, a) => {
          // all we need to do in this block is to fill out GameInfo object

          // generate Date object indicating the games' date
          const day = $(td).find('span.day').text().trim();
          const game_date = new Date(`${year}-${month}-${day}`);

          // declare away/home team, game status
          let away_team: KBOTeam = KBOTeam.NONE;
          let home_team: KBOTeam = KBOTeam.NONE;
          let game_status: GameStatus;

          const href = $(a).attr('href');
          // if the game id exists
          if (href) {
            // matching game id
            const regex = /s_no=(\d+)/;
            const gameId = href.match(regex)[1];
            if (!gameId) {
              throw new NotFoundException('Game id has not been found.');
            }

            // find team names
            const awayName = $(a).find('span.team').eq(0).text().trim();
            const homeName = $(a).find('span.team').eq(1).text().trim();

            // check team names are valid and store them
            if (isKBOTeam(awayName) && isKBOTeam(homeName)) {
              away_team = awayName as KBOTeam;
              home_team = homeName as KBOTeam;
            } else {
              throw new NotFoundException('KBO team name has not been found.');
            }

            // if the game has been canceled
            if ($(a).find('.weather.rain').length > 0) {
              game_status = GameStatus.CANCELED;
            } else {
              /**
               * the below line has to be changed someday.
               * when the new KBO season begins, default value cannot be FINISHED.
               * this is almost a mocking
               */
              game_status = GameStatus.FINISHED;
            }

            // generate GameInfo object and store it to the Map
            const gameInfo: GameInfo = {
              game_date,
              away_team,
              home_team,
              game_status,
            };

            gameInfoMap.set(gameId, gameInfo);
          }
        });
    });

    return gameInfoMap;
  }

  /**
   * method for getting annual KBO datum from STATIZ
   * @param year target year
   * @returns Map storing game id as a key, GameInfo as a value
   */
  async getAnnualGameInfos(year: number): Promise<Map<string, GameInfo>> {
    // create a Map
    const gameInfoMap = new Map<string, GameInfo>();

    // parallelly crawling game ids
    const promises = [];
    for (let month = 1; month <= 12; month++) {
      promises.push(this.getMonthlyGameIds(year, month));
    }

    const results: Map<string, GameInfo>[] = await Promise.all(promises);

    // concatenate Maps
    for (const monthlyGameInfoMap of results) {
      for (const key of monthlyGameInfoMap.keys()) {
        gameInfoMap.set(key, monthlyGameInfoMap.get(key));
      }
    }

    // logging
    for (const key of gameInfoMap.keys()) {
      this.logger.debug(`gameId: ${key}`);
      this.logger.debug('GameInfo:', gameInfoMap.get(key));
    }

    // return the Map
    return gameInfoMap;
  }

  /**
   * method for getting game statistics by game id
   * Notice: it needs to be called with game id of progressing, or finished game. NOT THE CANCELED ID.
   * @param gameId target game id
   * @returns one single object containing away/home teams' bat stats, pitch stats
   */
  async getTeamStatsByGameId(gameId: string): Promise<TeamStats> {
    // create the cheerio root
    const url = this.getBoxscoreUrl(gameId);
    const $ = await this.parseRoot(url);

    // extract away/home score
    const away_score = Number(
      $('div.game_schedule.result div.score span').eq(0).text().trim(),
    );
    const home_score = Number(
      $('div.game_schedule.result div.score span').eq(1).text().trim(),
    );

    // extract away bat stats
    const awayBatValues: number[] = [];
    $('div.box_type_boared')
      .eq(0)
      .find('tr.total td:not(.align_left)')
      .each((index, td) => {
        awayBatValues.push(Number($(td).text().trim()));
      });
    // map values to BatInfo type object
    const awayBatInfo: BatInfo = mapValuesToObject<BatInfo>(
      awayBatValues,
      batColumnMap,
    );

    // extract home bat stats
    const homeBatValues: number[] = [];
    $('div.box_type_boared')
      .eq(1)
      .find('tr.total td:not(.align_left)')
      .each((index, td) => {
        homeBatValues.push(Number($(td).text().trim()));
      });
    // map values to BatInfo type object
    const homeBatInfo: BatInfo = mapValuesToObject<BatInfo>(
      homeBatValues,
      batColumnMap,
    );

    // extract away pitch stats
    const awayPitchValues: number[] = [];
    $('div.box_type_boared')
      .eq(2)
      .find('tr.total td:not(.align_left)')
      .each((index, td) => {
        const value = $(td).text().trim();
        if (isNaN(Number(value)) && value.includes('-')) {
          awayPitchValues.push(...value.split('-').map(Number));
        } else {
          awayPitchValues.push(Number(value));
        }
      });
    // map values to PitchInfo type object
    const awayPitchInfo: PitchInfo = mapValuesToObject<PitchInfo>(
      awayPitchValues,
      pitchColumnMap,
    );

    // extract home pitch stats
    const homePitchValues: number[] = [];
    $('div.box_type_boared')
      .eq(3)
      .find('tr.total td:not(.align_left)')
      .each((index, td) => {
        const value = $(td).text().trim();
        if (isNaN(Number(value)) && value.includes('-')) {
          homePitchValues.push(...value.split('-').map(Number));
        } else {
          homePitchValues.push(Number(value));
        }
      });
    // map values to PitchInfo type object
    const homePitchInfo: PitchInfo = mapValuesToObject<PitchInfo>(
      homePitchValues,
      pitchColumnMap,
    );

    // generate one single TeamStats type object with the above generated objects
    const teamStats: TeamStats = {
      away_score,
      home_score,
      bat_stats_away: awayBatInfo,
      bat_stats_home: homeBatInfo,
      pitch_stats_away: awayPitchInfo,
      pitch_stats_home: homePitchInfo,
    };

    // this.logger.debug(teamStats);

    return teamStats;
  }

  /**
   * method for getting annual games' datum and store them to MongoDB
   * @param year target year
   */
  async loadAnnualGames(year: number): Promise<void> {
    // get annual game information mapped by game id
    const gameInfoMap = await this.getAnnualGameInfos(year);

    // parallelly crawling game statistics
    const teamStatsList: (TeamStats | null)[] = await Promise.all(
      // from game information map, extract game id and game information
      Array.from(gameInfoMap.entries()).map(async ([gameId, gameInfo]) => {
        // if the game has not been finished, its statistics does not exist
        if (gameInfo.game_status !== GameStatus.FINISHED) {
          // so, just return null to match results array's index to the gameInfoMap's index
          return Promise.resolve(null);
        }

        // if the game's information has already been stored
        const game = await this.gamesRepository.findGameByGameId(gameId);
        // and its game status has already been stored as the same
        if (game && game.game_status === gameInfo.game_status) {
          return Promise.resolve(null);
        }

        // or else additionally do crawling to get its statistics
        return this.getTeamStatsByGameId(gameId);
      }),
    );

    // again, parallelly store the whole game datum
    const promises = [];
    let index = 0;
    gameInfoMap.forEach((value, key) => {
      const gameStatsDto: GameStatsDto = plainToClass(GameStatsDto, {
        gameId: key,
        gameInfo: value,
        teamStats: teamStatsList[index++],
      });
      promises.push(this.gameService.loadGameStats(gameStatsDto));
    });

    await Promise.all(promises);
  }

  /**
   * method for crawling annual games once at a day
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async reloadAnnualGames(): Promise<void> {
    this.logger.debug('Crawler service has started to scrap annual games');

    try {
      await this.loadAnnualGames(new Date().getFullYear());
    } catch (error) {
      this.logger.debug(
        `Error occurred while crawling annual games: ${error.message}`,
      );
    }
  }
}
