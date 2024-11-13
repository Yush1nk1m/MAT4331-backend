import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CrawlerController } from './crawler/crawler.controller';
import { CrawlerService } from './crawler/crawler.service';
import { RepositoryModule } from './repository/repository.module';
import { GameModule } from './game/game.module';
import { CrawlerModule } from './crawler/crawler.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env' : undefined,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
    }),
    // Mongoose module confiruation
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_DB_URI'),
      }),
    }),
    RepositoryModule,
    GameModule,
    CrawlerModule,
  ],
  controllers: [AppController, CrawlerController],
  providers: [AppService, CrawlerService],
})
export class AppModule {}
