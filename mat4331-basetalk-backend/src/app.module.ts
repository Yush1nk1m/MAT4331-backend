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

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    MemberModule,
    GameModule,
    ChatModule,
    ChatroomModule,
    MemberChatroomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
