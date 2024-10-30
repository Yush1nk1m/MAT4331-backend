import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { MemberModule } from '../member/member.module';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [PassportModule, MemberModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
