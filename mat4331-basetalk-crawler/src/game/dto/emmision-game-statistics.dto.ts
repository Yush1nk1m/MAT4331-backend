import { BatInfo } from 'src/common/types/bat-info.type';
import { PitchInfo } from 'src/common/types/pitch-info.type';

export class EmissionGameStatisticsDto {
  game_id: string;
  away_team_stats: Array<{
    bat_info: BatInfo;
    pitch_info: PitchInfo;
  }>;
  home_team_stats: Array<{
    bat_info: BatInfo;
    pitch_info: PitchInfo;
  }>;
}
