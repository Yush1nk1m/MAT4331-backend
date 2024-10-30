import { Injectable, Logger } from '@nestjs/common';
import { Member } from '../member/member.entity';
import { GoogleProfileDto } from './dto/google-profile.dto';
import { MemberRepository } from '../member/member.repository';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('[Auth Service]');

  constructor(private readonly memberRepository: MemberRepository) {}

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
}
