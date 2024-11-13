import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { MemberModule } from './member/member.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { MemberChatroomModule } from './member-chatroom/member-chatroom.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV !== 'production' ? '.env' : undefined,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory() {
        return typeOrmConfig;
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    // Scheduler configuration
    ScheduleModule.forRoot(),
    MemberModule,
    GameModule,
    ChatModule,
    ChatroomModule,
    MemberChatroomModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
