import { Faction } from "./Faction";

export interface GameObject {
    id: string;
    name?: string;
    playerId: number;
    type: 'unit' | 'module' | 'action';
    faction: Faction;
    keywords: string[];
  }