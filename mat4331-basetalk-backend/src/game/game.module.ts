import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { GameRepository } from './game.repository';
import { ClientsModule } from '@nestjs/microservices';
import { rmqMainToCrawlerOption } from 'config/rmq.option';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    // RabbitMQ consumer configuration
    ClientsModule.register([rmqMainToCrawlerOption]),
  ],
  controllers: [GameController],
  providers: [GameService, GameRepository],
})
export class GameModule {}
