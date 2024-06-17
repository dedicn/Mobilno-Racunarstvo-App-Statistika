import { Player } from "./player.model";

export interface Team {
  teamID: string;
  name: string;
  players: Player[] | null;
  isActive: boolean;
}
