import { Tile } from './Tile';

export interface Cell {
  x: number;
  y: number;
  tiles: Tile[] | null;
}