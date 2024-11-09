import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { RedisModule } from '../redis/redis.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { MemberModule } from '../member/member.module';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { ChatroomModule } from '../chatroom/chatroom.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    MemberModule,
    ChatroomModule,
    RedisModule,
    JwtModule,
  ],
  providers: [ChatGateway, ChatService, ChatRepository],
  exports: [ChatService],
})
export class ChatModule {}
