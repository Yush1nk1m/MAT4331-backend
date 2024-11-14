import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';
import { GoogleProfileDto } from '../auth/dto/google-profile.dto';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class MemberService {
  private readonly logger: Logger = new Logger(MemberService.name);

  constructor(private readonly memberRepository: MemberRepository) {}

  /**
   * method for finding member by id
   * @param memberId member's id
   * @returns found member
   */
  async findMemberById(memberId: number): Promise<Member> {
    return this.memberRepository.findMemberById(memberId);
  }

  async validateMemberById(memberId: number): Promise<Member> {
    this.logger.debug(`Start to validate member id: ${memberId}`);

    const member: Member = await this.memberRepository.findMemberById(memberId);

    this.logger.debug(`Found member: ${JSON.stringify(member)}`);

    if (!member) {
      throw new NotFoundException(`Member with id: ${memberId} has not found`);
    }

    return member;
  }

  /**
   * method for finding member by email
   * @param email member's email
   * @returns found member
   */
  async findMemberByEmail(email: string): Promise<Member> {
    return this.memberRepository.findMemberByEmail(email);
  }

  /**
   * method for creating Google OAuth2 signed member
   * @param googleProfileDto member's email, firstName, lastName, picture
   * @returns created member
   */
  async createGoogleMember(
    googleProfileDto: GoogleProfileDto,
  ): Promise<Member> {
    return this.memberRepository.createGoogleMember(googleProfileDto);
  }

  /**
   * method for creating the new member signed from local
   * @param signUpDto member's email, hashed password, nickname, preferTeam
   * @returns created member
   */
  async createLocalMember(signUpDto: SignUpDto): Promise<Member> {
    return this.memberRepository.createLocalMember(signUpDto);
  }

  /**
   * method for deleting the member by id
   * @param memberId member's id
   */
  async deleteMemberById(memberId: number): Promise<void> {
    await this.memberRepository.deleteMemberById(memberId);
  }
}
