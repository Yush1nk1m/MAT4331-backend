import mongoose from 'mongoose';
import { GameStatus } from '../types/game-status.enum';
import { KBOTeam } from '../types/KBO-team.enum';

export class CreateGamesDto {
  game_id: string;
  game_date: Date;
  home_team: KBOTeam;
  away_team: KBOTeam;
  game_status: GameStatus;
  home_score?: number;
  away_score?: number;
  bat_stats_home?: mongoose.Types.ObjectId;
  bat_stats_away?: mongoose.Types.ObjectId;
  pitch_stats_home?: mongoose.Types.ObjectId;
  pitch_stats_away?: mongoose.Types.ObjectId;
}
