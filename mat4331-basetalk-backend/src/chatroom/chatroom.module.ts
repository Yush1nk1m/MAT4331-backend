import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chatroom } from './chatroom.entity';
import { ChatroomRepository } from './chatroom.repository';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';
import { GameModule } from '../game/game.module';
import { MemberChatroomModule } from '../member-chatroom/member-chatroom.module';
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chatroom]),
    MemberModule,
    GameModule,
    MemberChatroomModule,
  ],
  providers: [ChatroomRepository, ChatroomService],
  exports: [ChatroomService],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
