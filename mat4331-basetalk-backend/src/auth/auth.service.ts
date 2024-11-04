import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Member } from '../member/member.entity';
import { GoogleProfileDto } from './dto/google-profile.dto';
import { MemberRepository } from '../member/member.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ValidateMemberDto } from './dto/validate-member.dto';
import { TokensDto } from './dto/tokens.dto';
import { RedisService } from 'src/redis/redis.service';
import { AccessToken } from '../common/types/access-token.type';
import { JwtPayload } from '../common/types/jwt-payload.type';
import {
  jwtAccessOptions,
  jwtGrantCodeOptions,
  jwtRefreshOptions,
} from '../config/jwt.config';
import { VerifyGrantCodeDto } from './dto/verify-grant-code.dto';
import { GrantCodePayload } from '../common/types/grant-code-paylaod.type';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('[Auth Service]');

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * method for logging in or signing up the member
   * @param googleProfileDto google oauth2 profile
   * @returns found or created member
   */
  async findOrCreateGoogleMember(
    googleProfileDto: GoogleProfileDto,
  ): Promise<Member> {
    // find the member on DB
    const member = await this.memberRepository.findMemberByEmail({
      email: googleProfileDto.email,
    });

    this.logger.debug(`found member: ${member.nickname}`);

    // if the member does not exist, create new member on DB
    if (!member) {
      return this.memberRepository.createGoogleMember(googleProfileDto);
    }

    return member;
  }

  /**
   * method for issuing token grant code to get JWT tokens when the member is trying to log in with OAuth2
   * @param member Member type object
   * @returns issued grant code encrypted by JWT
   */
  async issueTokenGrantCode(member: Member): Promise<string> {
    // define JWT payload
    const payload: GrantCodePayload = { sub: member.id };

    // issue grant code
    const code = this.jwtService.sign(payload, jwtGrantCodeOptions);

    // store it to Redis
    await this.redisService.setGrantCode(member.id, code);

    // return the grant code
    return code;
  }

  /**
   * method for verifying grant code to log in by OAuth
   * @param verifyGrantCodeDto grant code issued by OAuth login
   * @returns JWT access token, refresh token
   */
  async verifyTokenGrantCode(
    verifyGrantCodeDto: VerifyGrantCodeDto,
  ): Promise<TokensDto> {
    // destruct DTO
    const { code } = verifyGrantCodeDto;

    // decode the JWT grant code
    let decoded: GrantCodePayload;
    try {
      // verify grant code and get the payload
      decoded = await this.jwtService.verifyAsync<GrantCodePayload>(
        code,
        jwtGrantCodeOptions,
      );
    } catch {
      throw new UnauthorizedException('Grant code is invalid or expired');
    }

    // extract the member's id
    const memberId = decoded.sub;

    // find grant code from Redis
    const foundCode = await this.redisService.getGrantCode(memberId);
    // if the found grant code does not exist or not the same as passed code
    if (!foundCode || foundCode !== code) {
      // throw Unauthorized exception
      throw new UnauthorizedException('Grant code is invalid or expired');
    }

    // delete the grant code from Redis to prevent being used
    await this.redisService.deleteGrantCode(memberId);

    // find member from DB
    const member = await this.memberRepository.findMemberById({
      id: memberId,
    });

    // if member has not been found, throw NotFound exception
    if (!member) {
      throw new NotFoundException(`Member with id: ${memberId} not found`);
    }

    // create JWT payload
    const jwtPayload: JwtPayload = {
      sub: member.id,
      nickname: member.nickname,
      profile: member.profile,
      preferTeam: member.preferTeam,
    };

    // issue JWT tokens
    return this.issueJwtTokens(jwtPayload);
  }

  /**
   * method for validating member information when he or she's email and password has passed
   * @param validateMemberDto member's email and password
   * @returns MemberPayload type object for generating JWT tokens
   */
  async validateMember(
    validateMemberDto: ValidateMemberDto,
  ): Promise<JwtPayload> {
    // destruct DTO
    const { email, password } = validateMemberDto;

    // find a member from DB
    const member = await this.memberRepository.findMemberByEmail({ email });

    // if the member exists and password is correct
    if (
      member &&
      member.password &&
      (await bcrypt.compare(password, member.password))
    ) {
      // return JWT payload to generate JWT tokens
      const jwtPayload = {
        sub: member.id,
        nickname: member.nickname,
        profile: member.profile,
        preferTeam: member.preferTeam,
      };

      return jwtPayload;
    }

    // or else, return null
    return null;
  }

  /**
   * method for logging in and getting JWT tokens
   * @param jwtPaylod sub, nickname, profile(image), preferTeam
   * @returns access token, refresh token
   */
  async login(jwtPayload: JwtPayload): Promise<TokensDto> {
    // issue JWT tokens
    const tokens = await this.issueJwtTokens(jwtPayload);

    // store refresh token in Redis
    await this.redisService.setRefreshToken(
      jwtPayload.sub,
      tokens.refreshToken,
      60 * 60 * 24 * 30,
    );

    // return the generated tokens
    return tokens;
  }

  /**
   * method for issuing JWT tokens
   * @param jwtPayload payload of JWT token
   * @returns access token, refresh token
   */
  async issueJwtTokens(jwtPayload: JwtPayload): Promise<TokensDto> {
    return {
      accessToken: await this.jwtService.signAsync(
        jwtPayload,
        jwtAccessOptions,
      ),
      refreshToken: await this.jwtService.signAsync(
        jwtPayload,
        jwtRefreshOptions,
      ),
    };
  }

  /**
   * method for verifying access token
   * @param accessToken member's access token
   * @returns decoded token's payload
   */
  async verifyAccessToken(accessToken: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync<JwtPayload>(
        accessToken,
        jwtAccessOptions,
      );
    } catch (error) {
      throw new Error('Token is invalid or expired');
    }
  }

  /**
   * method for refreshing access token
   * @param refreshToken passed refresh token
   * @returns an object containing the new access token, if the token is not valid then return null
   */
  async refreshToken(refreshToken: string): Promise<AccessToken> {
    // decode the old refresh token
    let decoded: JwtPayload;
    try {
      // verify refresh token and get the payload
      decoded = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        jwtRefreshOptions,
      );
    } catch (error) {
      // if the passed token is invalid, throw Unauthorized exception
      throw new UnauthorizedException('Failed to verify refresh token');
    }

    // get the stored refresh token from Redis
    const storedRefreshToken = await this.redisService.getRefreshToken(
      decoded.sub,
    );

    // if the stored token and passed token are the same
    if (storedRefreshToken && storedRefreshToken === refreshToken) {
      // create the JWT payload
      const payload: JwtPayload = {
        sub: decoded.sub,
        nickname: decoded.nickname,
        profile: decoded.profile,
        preferTeam: decoded.preferTeam,
      };

      // sign new access token
      const newAccessToken = this.jwtService.sign(payload, jwtAccessOptions);

      // and return it
      return {
        accessToken: newAccessToken,
      };
    }

    // or else, return null
    return null;
  }

  /**
   * method for logging out and deleting member's refresh token in Redis
   * @param memberId member's id
   */
  async logout(memberId: number): Promise<void> {
    await this.redisService.deleteRefreshToken(memberId);
  }
}
