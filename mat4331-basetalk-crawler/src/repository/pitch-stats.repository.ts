import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PitchStats } from '../schemas/pitch-stats.schema';
import { Model } from 'mongoose';
import { PitchInfo } from '../common/types/pitch-info.type';
import { KBOTeam } from 'src/common/types/KBO-team.enum';

@Injectable()
export class PitchStatsRepository {
  private readonly logger: Logger = new Logger(PitchStatsRepository.name);

  constructor(
    @InjectModel(PitchStats.name)
    private readonly model: Model<PitchStats>,
  ) {}

  /**
   * method for storing PitchStats document
   * @param game_id game's id
   * @param team team's name
   * @param game_date game's date
   * @param pitchInfo pitch statistics
   * @returns saved PitchStats document
   */
  async createByPitchInfo(
    game_id: string,
    team: KBOTeam,
    game_date: Date,
    pitchInfo: PitchInfo,
  ): Promise<PitchStats> {
    const pitchStat = new this.model({
      game_id,
      team,
      game_date,
      ...pitchInfo,
    });
    return pitchStat.save();
  }

  async findAverageStatsByTeamAndDate(
    team: KBOTeam,
    date: Date,
  ): Promise<PitchInfo> {
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
          IP: { $avg: '$IP' },
          TBF: { $avg: '$TBF' },
          H: { $avg: '$H' },
          R: { $avg: '$R' },
          ER: { $avg: '$ER' },
          BB: { $avg: '$BB' },
          HBP: { $avg: '$HBP' },
          K: { $avg: '$K' },
          HR: { $avg: '$HR' },
          GO: { $avg: '$GO' },
          FO: { $avg: '$FO' },
          NP: { $avg: '$NP' },
          S: { $avg: '$S' },
          IR: { $avg: '$IR' },
          IS: { $avg: '$IS' },
          GSC: { $avg: '$GSC' },
          ERA: { $avg: '$ERA' },
          WHIP: { $avg: '$WHIP' },
          LI: { $avg: '$LI' },
          WPA: { $avg: '$WPA' },
          RE24: { $avg: '$RE24' },
        },
      },
    ]);

    if (result.length === 0) {
      return {
        IP: 0,
        TBF: 0,
        H: 0,
        R: 0,
        ER: 0,
        BB: 0,
        HBP: 0,
        K: 0,
        HR: 0,
        GO: 0,
        FO: 0,
        NP: 0,
        S: 0,
        IR: 0,
        IS: 0,
        GSC: 0,
        ERA: 0,
        WHIP: 0,
        LI: 0,
        WPA: 0,
        RE24: 0,
      };
    }

    const [pitchInfo] = result;
    delete pitchInfo._id;

    return pitchInfo;
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
  ): Promise<PitchInfo[]> {
    // find the specified team's recent statistics
    const pitchStats: PitchStats[] = await this.model.aggregate([
      { $match: { team, game_date: { $lt: game_date } } },
      { $sort: { game_date: -1 } },
      { $limit: count },
      {
        $project: {
          _id: 0,
          IP: 1,
          TBF: 1,
          H: 1,
          R: 1,
          ER: 1,
          BB: 1,
          HBP: 1,
          K: 1,
          HR: 1,
          GO: 1,
          FO: 1,
          NP: 1,
          S: 1,
          IR: 1,
          IS: 1,
          GSC: 1,
          ERA: 1,
          WHIP: 1,
          LI: 1,
          WPA: 1,
          RE24: 1,
        },
      },
    ]);

    // map to the array of PitchInfo type
    const mappedStats: PitchInfo[] = pitchStats.map((pitchStat) => ({
      IP: pitchStat.IP || 0,
      TBF: pitchStat.TBF || 0,
      H: pitchStat.H || 0,
      R: pitchStat.R || 0,
      ER: pitchStat.ER || 0,
      BB: pitchStat.BB || 0,
      HBP: pitchStat.HBP || 0,
      K: pitchStat.K || 0,
      HR: pitchStat.HR || 0,
      GO: pitchStat.GO || 0,
      FO: pitchStat.FO || 0,
      NP: pitchStat.NP || 0,
      S: pitchStat.S || 0,
      IR: pitchStat.IR || 0,
      IS: pitchStat.IS || 0,
      GSC: pitchStat.GSC || 0,
      ERA: pitchStat.ERA || 0,
      WHIP: pitchStat.WHIP || 0,
      LI: pitchStat.LI || 0,
      WPA: pitchStat.WPA || 0,
      RE24: pitchStat.RE24 || 0,
    }));

    // empty data for filling
    const defaultPitchInfo: PitchInfo = {
      IP: 0,
      TBF: 0,
      H: 0,
      R: 0,
      ER: 0,
      BB: 0,
      HBP: 0,
      K: 0,
      HR: 0,
      GO: 0,
      FO: 0,
      NP: 0,
      S: 0,
      IR: 0,
      IS: 0,
      GSC: 0,
      ERA: 0,
      WHIP: 0,
      LI: 0,
      WPA: 0,
      RE24: 0,
    };

    // fill in the array with the default data
    while (mappedStats.length < count) {
      mappedStats.push(defaultPitchInfo);
    }

    return mappedStats;
  }
}
