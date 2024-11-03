import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Member } from 'src/member/member.entity';

export class MemberPayloadDto extends PickType(Member, [
  'id',
  'nickname',
  'profile',
  'preferTeam',
] as const) {
  @Expose({ name: 'sub' })
  id: number;
}
