import { BatInfo } from './bat-info.type';
import { PitchInfo } from './pitch-info.type';

export interface TeamStats {
  home_score: number;
  away_score: number;
  bat_stats_home: BatInfo;
  bat_stats_away: BatInfo;
  pitch_stats_home: PitchInfo;
  pitch_stats_away: PitchInfo;
}
