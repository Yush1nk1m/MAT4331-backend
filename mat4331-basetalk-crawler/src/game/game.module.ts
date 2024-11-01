import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RepositoryModule } from '../repository/repository.module';

@Module({
  imports: [RepositoryModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
