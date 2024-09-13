import { Tile } from './Tile';

export interface Player {
  id: number;
  name: string;
  hand: Tile[];
  drawPile: Tile[];
  discardPile: Tile[];
}