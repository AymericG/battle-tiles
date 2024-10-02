import { GameObjectId } from "../store/types";
import { Faction } from "./Faction";

export interface GameObject {
    id: GameObjectId;
    name?: string;
    type: 'unit' | 'module' | 'action';
    faction: Faction;
    keywords: string[];
  }

export interface GameObjectInstance {
    playerId: number;
    id: string;
    objectId: GameObjectId;
}
  