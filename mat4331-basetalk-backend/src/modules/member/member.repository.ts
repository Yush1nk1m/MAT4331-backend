import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { GoogleProfileDto } from '../auth/dto/google-profile.dto';
import { MemberType } from '../../common/types/member-type.enum';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {}

  /**
   * method for finding member by email
   * @param email member's email address
   * @returns found member
   */
  async findMemberByEmail(email: string): Promise<Member> {
    // find the member by email and return
    return this.repository.findOneBy({ email });
  }

  /**
   * method for finding member by id
   * @param id member's generated id
   * @returns found member
   */
  async findMemberById(id: number): Promise<Member> {
    // find the member by id and return
    return this.repository.findOneBy({ id });
  }

  /**
   * method for creating the new member signed from google OAuth2
   * @param googleProfileDto member's email, firstName, lastName, picture
   * @returns created member
   */
  async createGoogleMember(
    googleProfileDto: GoogleProfileDto,
  ): Promise<Member> {
    // destruct dto
    const { email, firstName, lastName, picture } = googleProfileDto;
    // save the member and return
    const member: Member = this.repository.create({
      email,
      nickname: `${lastName} ${firstName}`,
      profile: picture,
      type: MemberType.OAUTH,
    });
    return this.repository.save(member);
  }

  /**
   * method for creating the new member signed from local
   * @param signUpDto member's email, hashed password, nickname, preferTeam
   * @returns created member
   */
  async createLocalMember(signUpDto: SignUpDto): Promise<Member> {
    // destruct DTO
    const { email, password, nickname, preferTeam } = signUpDto;

    // save the member and return
    const member: Member = this.repository.create({
      email,
      password,
      nickname,
      preferTeam,
      type: MemberType.LOCAL,
    });
    return this.repository.save(member);
  }

  /**
   * method for deleting the member by id
   * @param id member's id
   */
  async deleteMemberById(id: number): Promise<void> {
    // delete the member
    await this.repository.delete({ id });
  }
}
