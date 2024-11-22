import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BatStats } from '../schemas/bat-stats.schema';
import { BatInfo } from '../common/types/bat-info.type';
import { KBOTeam } from 'src/common/types/KBO-team.enum';

@Injectable()
export class BatStatsRepository {
  private readonly logger: Logger = new Logger(BatStatsRepository.name);

  constructor(
    @InjectModel(BatStats.name)
    private readonly model: Model<BatStats>,
  ) {}

  /**
   * method for storing BatInfo type document
   * @param data bat datum crawled by service
   * @returns saved BatStats document
   */
  /**
   * method for storing BatStats document
   * @param game_id game's id
   * @param team team's name
   * @param game_date game's date
   * @param batInfo bat statistics
   * @returns saved BatStats document
   */
  async createByBatInfo(
    game_id: string,
    team: KBOTeam,
    game_date: Date,
    batInfo: BatInfo,
  ): Promise<BatStats> {
    const batStat = new this.model({ game_id, team, game_date, ...batInfo });
    return batStat.save();
  }

  /**
   * method for finding average bat statistics of specified team for specified date
   * @param team KBO team
   * @param date date
   * @returns
   */
  async findAverageStatsByTeamAndDate(
    team: KBOTeam,
    date: Date,
  ): Promise<BatInfo> {
    const result = await this.model.aggregate([
      // filter by team and date
      {
        $match: {
          team,
          game_date: { $lt: date },
        },
      },
      // calculate average
      {
        $group: {
          _id: null,
          PA: { $avg: '$PA' },
          AB: { $avg: '$AB' },
          R: { $avg: '$R' },
          H: { $avg: '$H' },
          HR: { $avg: '$HR' },
          RBI: { $avg: '$RBI' },
          BB: { $avg: '$BB' },
          HBP: { $avg: '$HBP' },
          SO: { $avg: '$SO' },
          GO: { $avg: '$GO' },
          FO: { $avg: '$FO' },
          NP: { $avg: '$NP' },
          GDP: { $avg: '$GDP' },
          LOB: { $avg: '$LOB' },
          ABG: { $avg: '$ABG' },
          OPS: { $avg: '$OPS' },
          LI: { $avg: '$LI' },
          WPA: { $avg: '$WPA' },
          RE24: { $avg: '$RE24' },
        },
      },
    ]);

    if (result.length === 0) {
      return {
        PA: 0,
        AB: 0,
        R: 0,
        H: 0,
        HR: 0,
        RBI: 0,
        BB: 0,
        HBP: 0,
        SO: 0,
        GO: 0,
        FO: 0,
        NP: 0,
        GDP: 0,
        LOB: 0,
        ABG: 0,
        OPS: 0,
        LI: 0,
        WPA: 0,
        RE24: 0,
      };
    }

    const [batInfo] = result;
    delete batInfo._id;

    return batInfo;
  }

  /**
   * method for finding the recent N(count) games' statistics
   * @param team KBO team
   * @param game_date game's date
   * @param count the number of games needed to be tracked
   * @returns array of statistics
   */
  async findRecentStatsByTeam(
    team: KBOTeam,
    game_date: Date,
    count: number,
  ): Promise<BatInfo[]> {
    // find the specified team's recent statistics
    const batStats: BatStats[] = await this.model.aggregate([
      { $match: { team, game_date: { $lt: game_date } } },
      { $sort: { game_date: -1 } },
      { $limit: count },
      {
        $project: {
          _id: 0,
          PA: 1,
          AB: 1,
          R: 1,
          H: 1,
          HR: 1,
          RBI: 1,
          BB: 1,
          HBP: 1,
          SO: 1,
          GO: 1,
          FO: 1,
          NP: 1,
          GDP: 1,
          LOB: 1,
          ABG: 1,
          OPS: 1,
          LI: 1,
          WPA: 1,
          RE24: 1,
        },
      },
    ]);

    // map to the array of BatInfo type
    const mappedStats: BatInfo[] = batStats.map((batStat) => ({
      PA: batStat.PA || 0,
      AB: batStat.AB || 0,
      R: batStat.R || 0,
      H: batStat.H || 0,
      HR: batStat.HR || 0,
      RBI: batStat.RBI || 0,
      BB: batStat.BB || 0,
      HBP: batStat.HBP || 0,
      SO: batStat.SO || 0,
      GO: batStat.GO || 0,
      FO: batStat.FO || 0,
      NP: batStat.NP || 0,
      GDP: batStat.GDP || 0,
      LOB: batStat.LOB || 0,
      ABG: batStat.ABG || 0,
      OPS: batStat.OPS || 0,
      LI: batStat.LI || 0,
      WPA: batStat.WPA || 0,
      RE24: batStat.RE24 || 0,
    }));

    // empty data for filling
    const defaultBatInfo: BatInfo = {
      PA: 0,
      AB: 0,
      R: 0,
      H: 0,
      HR: 0,
      RBI: 0,
      BB: 0,
      HBP: 0,
      SO: 0,
      GO: 0,
      FO: 0,
      NP: 0,
      GDP: 0,
      LOB: 0,
      ABG: 0,
      OPS: 0,
      LI: 0,
      WPA: 0,
      RE24: 0,
    };

    // fill in the array with the default data
    while (mappedStats.length < count) {
      mappedStats.push(defaultBatInfo);
    }

    return mappedStats;
  }
}
