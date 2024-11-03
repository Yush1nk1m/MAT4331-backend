import { GameStatus } from 'src/common/types/game-status.enum';
import { KBOTeam } from 'src/common/types/KBO-team.enum';

export class EmissionGameDto {
  gameCid: string;
  awayTeam: KBOTeam;
  homeTeam: KBOTeam;
  awayScore?: number;
  homeScore?: number;
  gameStatus: GameStatus;
  gameDate: Date;
}
