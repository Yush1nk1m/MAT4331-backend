import { GameStatus } from '../../common/types/game-status.enum';
import { KBOTeam } from '../../common/types/KBO-team.enum';

/**
 * A type for storing a document of Games(Schema)
 * it only stores 'required' fields
 */
export interface GameInfo {
  game_date: Date;

  away_team: KBOTeam;

  home_team: KBOTeam;

  game_status: GameStatus;
}
