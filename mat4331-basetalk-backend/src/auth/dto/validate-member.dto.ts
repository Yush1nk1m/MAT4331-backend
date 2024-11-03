import { PickType } from '@nestjs/swagger';
import { Member } from 'src/member/member.entity';

export class ValidateMemberDto extends PickType(Member, [
  'email',
  'password',
] as const) {}
