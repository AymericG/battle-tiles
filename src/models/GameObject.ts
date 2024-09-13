import { Faction } from "./Faction";

export interface GameObject {
    id: string;
    playerId: number;
    type: 'unit' | 'module' | 'action';
    faction: Faction;
  }