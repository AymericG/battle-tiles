import { Faction } from './Faction';
import { GameObject } from './GameObject';

export interface Player {
  id: number;
  name: string;
  faction: Faction;
  hand: GameObject[];
  drawPile: GameObject[];
  discardPile: GameObject[];
}