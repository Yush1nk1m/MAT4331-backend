import { BatInfo } from 'src/common/types/bat-info.type';
import { PitchInfo } from 'src/common/types/pitch-info.type';

export class EmissionGameAverageDto {
  game_id: string;
  away_team: {
    bat_info: BatInfo;
    pitch_info: PitchInfo;
  };
  home_team: {
    bat_info: BatInfo;
    pitch_info: PitchInfo;
  };
}
