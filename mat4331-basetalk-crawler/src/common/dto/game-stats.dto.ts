import { GameInfo } from '../types/game-info.type';
import { TeamStats } from '../types/team-stats.type';

export class GameStatsDto {
  gameId: string;
  gameInfo: GameInfo;
  teamStats: TeamStats;
}
