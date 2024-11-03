import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { MemberModule } from '../member/member.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/config/jwt.config';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    // JWT configuration
    JwtModule.registerAsync(jwtConfig),
    RedisModule,
    PassportModule,
    MemberModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
