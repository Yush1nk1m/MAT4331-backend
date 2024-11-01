import { KBOTeam } from '../types/KBO-team.enum';

export function isKBOTeam(value: any): value is KBOTeam {
  return Object.values(KBOTeam).includes(value);
}
