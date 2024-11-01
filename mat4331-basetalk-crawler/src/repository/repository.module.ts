import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Games, GamesSchema } from '../schemas/games.schema';
import { BatStats, BatStatsSchema } from '../schemas/bat-stats.schema';
import { PitchStats, PitchStatsSchema } from '../schemas/pitch-stats.schema';
import { GamesRepository } from './games.repository';
import { BatStatsRepository } from './bat-stats.repository';
import { PitchStatsRepository } from './pitch-stats.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Games.name, schema: GamesSchema },
      { name: BatStats.name, schema: BatStatsSchema },
      { name: PitchStats.name, schema: PitchStatsSchema },
    ]),
  ],
  providers: [GamesRepository, BatStatsRepository, PitchStatsRepository],
  exports: [GamesRepository, BatStatsRepository, PitchStatsRepository],
})
export class RepositoryModule {}
