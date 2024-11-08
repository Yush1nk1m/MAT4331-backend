import { Module } from '@nestjs/common';
import { MemberChatroomService } from './member-chatroom.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberChatroom } from './member-chatroom.entity';
import { MemberChatroomRepository } from './member-chatroom.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MemberChatroom])],
  providers: [MemberChatroomService, MemberChatroomRepository],
  exports: [MemberChatroomService],
})
export class MemberChatroomModule {}
