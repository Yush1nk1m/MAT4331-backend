import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './chatroom.entity';
import { ChatroomRepository } from './chatroom.repository';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { GameModule } from '../game/game.module';
import { MemberChatroomModule } from '../member-chatroom/member-chatroom.module';
import { MemberModule } from '../member/member.module';
import { ChatroomGateway } from './chatroom.gateway';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatroom]),
    MemberModule,
    GameModule,
    MemberChatroomModule,
    RedisModule,
    JwtModule,
  ],
  providers: [ChatroomRepository, ChatroomService, ChatroomGateway],
  exports: [ChatroomService],
  controllers: [ChatroomController],
})
export class ChatroomModule {}