import { Team } from "./team.model";

export interface Game {
  id: string;
  gameCode: string;
  date: Date;
  homePoints: number;
  guestPoints: number;
  home: Team;
  guest: Team;
}
