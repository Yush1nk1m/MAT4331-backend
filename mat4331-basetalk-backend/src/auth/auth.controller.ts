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
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiFoundResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Member } from '../member/member.entity';
import { VerifyGrantCodeDto } from './dto/verify-grant-code.dto';
import { TokensDto } from './dto/tokens.dto';
import { JwtPayload } from '../common/types/jwt-payload.type';
import { LocalLoginDto } from './dto/local-login.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignedMemberDto } from './dto/signed-member.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Auth')
@ApiBadRequestResponse({
  description: '요청 형식이 유효하지 않다.',
})
@ApiInternalServerErrorResponse({
  description: '예기치 못한 서버 오류가 발생한다.',
})
@Controller('v1/auth')
export class AuthController {
  private readonly logger: Logger = new Logger('[Auth Controller]');

  constructor(private readonly authService: AuthService) {}

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
      '구글 OAuth Provider로부터 회원 정보를 획득하고 Grant code를 발급하여 리다이렉트한다.',
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
    const code: string = await this.authService.issueTokenGrantCode(member);

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
    const tokens: TokensDto =
      await this.authService.verifyTokenGrantCode(VerifyGrantCodeDto);

    // return the issued tokens
    return tokens;
  }

  @ApiOperation({
    summary: '[A-04] 로컬 로그인',
    description:
      '로컬 로그인 시 이메일과 비밀번호를 검증하고 JWT 토큰을 생성한다.',
  })
  @ApiOkResponse({
    description:
      '로그인에 성공하였으며 JWT 액세스 토큰, 리프레시 토큰을 발급한다.',
    type: TokensDto,
  })
  @ApiUnauthorizedResponse({
    description: '정확하지 않은 비밀번호로 인해 로그인에 실패한다.',
  })
  @ApiForbiddenResponse({
    description: 'OAuth 방식으로 가입한 회원은 로컬 로그인을 수행할 수 없다.',
  })
  @ApiNotFoundResponse({
    description: '가입되지 않은 회원이다.',
  })
  @Post('login/local')
  @HttpCode(HttpStatus.OK)
  async localLogin(@Body() localLoginDto: LocalLoginDto): Promise<TokensDto> {
    // validate the member and get JWT payload
    const jwtPayload: JwtPayload =
      await this.authService.validateLocalMember(localLoginDto);

    // issue JWT tokens
    const tokens: TokensDto = await this.authService.login(jwtPayload);

    // return tokens
    return tokens;
  }

  @ApiOperation({
    summary: '[A-05] 로컬 회원 가입',
    description:
      '이메일, 비밀번호, 닉네임, 선호 팀 정보를 받아 로컬 회원의 가입을 수행한다.',
  })
  @ApiCreatedResponse({
    description:
      '회원 가입에 성공하였으며 비밀번호를 제외한 회원의 정보를 응답한다.',
  })
  @ApiConflictResponse({
    description: '이미 존재하는 회원이다.',
  })
  @Post('sign-up/local')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDto): Promise<SignedMemberDto> {
    // sign up the member
    const signedMember: Member =
      await this.authService.signUpLocalMember(signUpDto);

    // plain to DTO instance and return
    const signedMemberDto: SignedMemberDto = plainToInstance(
      SignedMemberDto,
      signedMember,
      { excludeExtraneousValues: true },
    );

    return signedMemberDto;
  }
}
