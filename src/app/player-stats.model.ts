import { Game } from "./game.model";

export interface PlayerStats {
  game: Game;
  fauls: number;
  assists: number;
  onePM: number;
  twoPM: number;
  onePA: number;
  twoPA: number;
  OREB: number;
  DREB: number;
}
