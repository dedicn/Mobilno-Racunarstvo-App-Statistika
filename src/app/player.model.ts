import { PlayerStats } from "./player-stats.model";
import { Team } from "./team.model";

export interface Player {
  id: string;
  name: string;
  surname: string;
  number: number | null;
  selected: boolean;
  stats: PlayerStats | null;
}