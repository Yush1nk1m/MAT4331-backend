import { BatInfo } from './bat-info.type';
import { PitchInfo } from './pitch-info.type';

export interface TeamStat {
  bat_stat: BatInfo;
  pitch_stat: PitchInfo;
}
