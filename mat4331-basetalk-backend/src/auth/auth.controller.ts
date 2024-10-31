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

@ApiTags('Auth')
@Controller('auth/v1')
export class AuthController {
  private readonly logger: Logger = new Logger('[Auth Controller]');

  constructor(private readonly configService: ConfigService) {}

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

  /**
   * 미완성, 마지막 후처리를 어떻게 할 것인지 프론트엔드와 논의할 것
   */
  @ApiOperation({
    summary: '[A-02] 구글 OAuth Provider로부터 승인받은 리다이렉트 URI',
    description: '구글 OAuth Provider로부터 사용자 정보를 획득한다.',
  })
  @Get('login/oauth2/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const member = req.user;
    this.logger.verbose(`finally redirected member: ${member}`);

    // TODO: refine below response
    res.redirect('https://www.naver.com');
  }
}
