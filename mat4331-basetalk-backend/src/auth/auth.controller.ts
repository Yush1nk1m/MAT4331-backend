import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Member } from '../member/member.entity';

@ApiTags('Auth')
@ApiResponse({
  status: HttpStatus.INTERNAL_SERVER_ERROR,
  description: '예기치 못한 서버 오류가 발생한다.',
})
@Controller('auth/v1')
export class AuthController {
  private readonly logger: Logger = new Logger('[Auth Controller]');

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '[A-01] 구글 로그인 페이지 리다이렉트',
    description: '사용자를 구글 로그인 페이지로 리다이렉트한다.',
  })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Google OAuth 로그인 페이지로 리다이렉트한다.',
  })
  @Get('login/oauth2/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect to google login page
  }

  @ApiOperation({
    summary: '[A-02] 구글 OAuth Provider로부터 승인받은 리다이렉트 URI',
    description:
      '구글 OAuth Provider로부터 사용자 정보를 획득하고 Grant code를 발급하여 리다이렉트한다.',
  })
  @Get('login/oauth2/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    // get the OAuth2 member information
    const member = req.user as Member;
    this.logger.debug(`finally redirected member: ${member.nickname}`);

    // generate token grant code
    const code = this.authService.issueTokenGrantCode(member);

    // TODO: redirect service's actual loading page
    return res.redirect(`http://localhost:8080/?code=${code}`);
  }
}
