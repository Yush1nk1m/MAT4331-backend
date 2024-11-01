import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BatStats } from '../schemas/bat-stats.schema';
import { BatInfo } from '../common/types/bat-info.type';

@Injectable()
export class BatStatsRepository {
  constructor(
    @InjectModel(BatStats.name)
    private readonly model: Model<BatStats>,
  ) {}

  /**
   * method for storing BatInfo type document
   * @param data bat datum crawled by service
   * @returns saved BatStats document
   */
  async createByBatInfo(data: BatInfo): Promise<BatStats> {
    const batStat = new this.model(data);
    return batStat.save();
  }
}
