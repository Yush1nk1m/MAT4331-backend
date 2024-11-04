import { KBOTeam } from './KBO-team.enum';

export interface JwtPayload {
  sub: number;
  nickname: string;
  profile: string;
  preferTeam: KBOTeam;
}
