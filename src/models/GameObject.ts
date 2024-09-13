import { Faction } from "./Faction";

export interface GameObject {
    id: string;
    type: 'unit' | 'module' | 'action';
    faction: Faction;
  }