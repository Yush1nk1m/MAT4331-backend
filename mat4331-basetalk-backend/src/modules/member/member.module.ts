import { Module } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { RedisModule } from '../redis/redis.module';
import { ChatroomModule } from '../chatroom/chatroom.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), ChatroomModule, RedisModule],
  providers: [MemberRepository, MemberService],
  exports: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}
