import { Inject, Injectable, Logger } from '@nestjs/common';
import { Member } from '../member/member.entity';
import { GoogleProfileDto } from './dto/google-profile.dto';
import { MemberRepository } from '../member/member.repository';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { MemberPayloadDto } from './dto/member-payload.dto';
import { ValidateMemberDto } from './dto/validate-member.dto';
import { TokensDto } from './dto/tokens.dto';
import { RedisService } from 'src/redis/redis.service';

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

    this.logger.verbose(`found member: ${member}`);

    // if the member does not exist, create new member on DB
    if (!member) {
      return this.memberRepository.createGoogleMember(googleProfileDto);
    }

    return member;
  }

  /**
   * method for validating member information when he or she's email and password has passed
   * @param validateMemberDto member's email and password
   * @returns MemberPayload type object for generating JWT tokens
   */
  async validateMember(
    validateMemberDto: ValidateMemberDto,
  ): Promise<MemberPayloadDto> {
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
      // return member's payload to generate JWT tokens
      const memberPayloadDto = plainToInstance(MemberPayloadDto, member);
      return memberPayloadDto;
    }

    // or else, return null
    return null;
  }

  /**
   * method for logging in and getting JWT tokens
   * @param memberPayloadDto sub, nickname, profile(image), preferTeam
   * @returns access token, refresh token
   */
  async login(memberPayloadDto: MemberPayloadDto): Promise<TokensDto> {
    // sign JWT tokens
    const accessToken = this.jwtService.sign(memberPayloadDto);
    const refreshToken = this.jwtService.sign(memberPayloadDto, {
      expiresIn: '30d',
    });

    // store refresh token in Redis
    await this.redisService.setRefreshToken(
      memberPayloadDto.id,
      refreshToken,
      60 * 60 * 24 * 30,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
