import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PitchStats } from '../schemas/pitch-stats.schema';
import { Model } from 'mongoose';
import { PitchInfo } from '../common/types/pitch-info.type';

@Injectable()
export class PitchStatsRepository {
  constructor(
    @InjectModel(PitchStats.name)
    private readonly model: Model<PitchStats>,
  ) {}

  /**
   * method for storing PitchInfo type document
   * @param data pitch datum crawled by service
   * @returns saved PitchStats document
   */
  async createByPitchInfo(data: PitchInfo): Promise<PitchStats> {
    const pitchStat = new this.model(data);
    return pitchStat.save();
  }
}
