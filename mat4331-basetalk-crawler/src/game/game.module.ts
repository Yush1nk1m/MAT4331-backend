import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { RepositoryModule } from '../repository/repository.module';
import { GameController } from './game.controller';
import { ClientsModule } from '@nestjs/microservices';
import { rmqOption } from '../config/rmq.option';

@Module({
  imports: [
    RepositoryModule,
    // RabbitMQ module configuration
    ClientsModule.register([rmqOption]),
  ],
  providers: [GameService],
  exports: [GameService],
  controllers: [GameController],
})
export class GameModule {}
