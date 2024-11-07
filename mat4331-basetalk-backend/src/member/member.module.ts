import { Module } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberRepository, MemberService],
  exports: [MemberService],
})
export class MemberModule {}
