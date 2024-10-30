import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { EmailDto } from './types/email.dto';
import { GoogleProfileDto } from '../auth/dto/google-profile.dto';
import { MemberType } from './types/member-type.type';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  /**
   * method for finding member by email
   * @param emailDto member's email address
   * @returns found member
   */
  async findMemberByEmail(emailDto: EmailDto): Promise<Member> {
    const { email } = emailDto;
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * method for creating the new member
   * @param googleProfileDto google oauth2 information
   * @returns created member's information
   */
  async createGoogleMember(
    googleProfileDto: GoogleProfileDto,
  ): Promise<Member> {
    // extract dto
    const { email, firstName, lastName, picture } = googleProfileDto;
    // save the member on DB and return
    const member = this.repository.create({
      email,
      nickname: `${lastName} ${firstName}`,
      profile: picture,
      type: MemberType.SIGNED,
    });
    return this.repository.save(member);
  }
}
