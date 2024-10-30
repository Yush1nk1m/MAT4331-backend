import { Controller, Get, Logger, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('auth/v1')
export class AuthController {
  private readonly logger: Logger = new Logger('[Auth Controller]');

  constructor(private readonly configService: ConfigService) {}

  @Get()
  async test() {
    this.logger.verbose(this.configService.get<string>('GOOGLE_CLIENT_ID'));
  }

  @Get('login/oauth2/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect to google login page
  }

  @Get('login/oauth2/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const member = req.user;
    this.logger.verbose(`finally redirected member: ${member}`);

    res.redirect('https://www.naver.com');
  }
}
