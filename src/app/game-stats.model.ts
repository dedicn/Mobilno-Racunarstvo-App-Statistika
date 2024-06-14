import { Game } from "./game.model";

export interface GameStats {
  // game: Game;
  faulsHome: number;
  assistsHome: number;
  onePMHome: number;
  twoPMHome: number;
  onePAHome: number;
  twoPAHome: number;
  OREBHome: number;
  DREBHome: number;
  faulsGuest: number;
  assistsGuest: number;
  onePMGuest: number;
  twoPMGuest: number;
  onePAGuest: number;
  twoPAGuest: number;
  OREBGuest: number;
  DREBGuest: number;
  TOHome: number;
  TOGuest: number
}
