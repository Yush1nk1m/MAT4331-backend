import { Module } from '@nestjs/common';
import { GameModule } from '../game/game.module';
import { RepositoryModule } from 'src/repository/repository.module';

@Module({
  imports: [RepositoryModule, GameModule],
})
export class CrawlerModule {}
