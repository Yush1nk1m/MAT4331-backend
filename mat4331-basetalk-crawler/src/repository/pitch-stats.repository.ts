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
          TBP: { $avg: '$TBP' },
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
}
