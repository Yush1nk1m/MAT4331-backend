import { Module } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberRepository],
  exports: [MemberRepository],
})
export class MemberModule {}
