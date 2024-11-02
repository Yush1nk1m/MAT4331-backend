import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RepositoryModule } from '../repository/repository.module';
import { GameController } from './game.controller';

@Module({
  imports: [RepositoryModule],
  providers: [GameService],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}
