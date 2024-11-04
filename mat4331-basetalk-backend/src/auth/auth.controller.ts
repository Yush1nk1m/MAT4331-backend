import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Member } from '../member/member.entity';
import { VerifyGrantCodeDto } from './dto/verify-grant-code.dto';
import { TokensDto } from './dto/tokens.dto';

@ApiTags('Auth')
@ApiInternalServerErrorResponse({
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
  @ApiFoundResponse({
    description: 'Google OAuth 로그인 페이지로 리다이렉트한다.',
  })
  @Get('login/oauth2/google')
  @HttpCode(HttpStatus.FOUND)
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirect to google login page
  }

  @ApiOperation({
    summary: '[A-02] 구글 OAuth Provider로부터 승인받은 리다이렉트 URI',
    description:
      '구글 OAuth Provider로부터 사용자 정보를 획득하고 Grant code를 발급하여 리다이렉트한다.',
  })
  @ApiFoundResponse({
    description:
      'Basetalk 서비스의 로그인, 서비스 메인 페이지 간 중간 로딩 페이지로 리다이렉트한다.',
  })
  @Get('login/oauth2/google/redirect')
  @HttpCode(HttpStatus.FOUND)
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

  @ApiOperation({
    summary: '[A-03] OAuth 로그인을 위한 Grant code 검증 및 JWT 토큰 발급',
    description:
      'OAuth 방식으로 로그인 시 리다이렉트된 URI에서 확인할 수 있는 Grant code를 검증하고 JWT 토큰을 생성한다.',
  })
  @ApiOkResponse({
    description:
      'Grant code 검증에 성공하였으며 JWT 액세스 토큰, 리프레시 토큰을 발급한다.',
    type: TokensDto,
  })
  @Post('login/oauth2/grant-code')
  @HttpCode(HttpStatus.OK)
  async verifyGrantCode(
    @Body() VerifyGrantCodeDto: VerifyGrantCodeDto,
  ): Promise<TokensDto> {
    // verify grant code and issue JWT tokens
    const tokens =
      await this.authService.verifyTokenGrantCode(VerifyGrantCodeDto);

    // return the issued tokens
    return tokens;
  }
}
