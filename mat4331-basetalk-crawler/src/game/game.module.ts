import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RepositoryModule } from '../repository/repository.module';
import { GameController } from './game.controller';
import { ClientsModule } from '@nestjs/microservices';
import {
  rmqCralwerToAiOption,
  rmqCrawlerToMainOption,
} from 'src/config/rmq.option';

@Module({
  imports: [
    RepositoryModule,
    // RabbitMQ consumer configuration
    ClientsModule.register([rmqCrawlerToMainOption, rmqCralwerToAiOption]),
  ],
  providers: [GameService],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}
