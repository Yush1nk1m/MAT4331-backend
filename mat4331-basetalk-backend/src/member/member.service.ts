import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { Member } from './member.entity';
import { GoogleProfileDto } from '../auth/dto/google-profile.dto';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  /**
   * method for finding member by id
   * @param memberId member's id
   * @returns found member
   */
  async findMemberById(memberId: number): Promise<Member> {
    return this.memberRepository.findMemberById(memberId);
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
