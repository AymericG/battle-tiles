import { Faction } from './Faction';
import { GameObjectInstance } from './GameObject';

export interface Player {
  id: number;
  name: string;
  faction: Faction;
  hand: GameObjectInstance[];
  drawPile: GameObjectInstance[];
  discardPile: GameObjectInstance[];
  lost: boolean;
}