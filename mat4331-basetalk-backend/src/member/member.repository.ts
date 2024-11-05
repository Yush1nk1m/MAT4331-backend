import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { Repository } from 'typeorm';
import { EmailDto } from './dto/email.dto';
import { GoogleProfileDto } from '../auth/dto/google-profile.dto';
import { MemberType } from '../common/types/member-type.enum';
import { IdDto } from './dto/id.dto';
import { SignUpDto } from '../auth/dto/sign-up.dto';

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
    // destruct DTO
    const { email } = emailDto;
    // find the member by email and return
    return this.repository.findOne({
      where: {
        email,
      },
    });
  }

  /**
   * method for finding member by id
   * @param idDto member's generated id
   * @returns found member
   */
  async findMemberById(idDto: IdDto): Promise<Member> {
    // destruct DTO
    const { id } = idDto;
    // find the member by id and return
    return this.repository.findOne({
      where: {
        id,
      },
    });
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
   * @param idDto member's id
   */
  async deleteMemberById(idDto: IdDto): Promise<void> {
    // destruct DTO
    const { id } = idDto;
    // delete the member
    await this.repository.delete({ id });
  }
}
