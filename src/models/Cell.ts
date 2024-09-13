import { GameObject } from './GameObject';

export interface Cell {
  x: number;
  y: number;
  tiles: GameObject[] | null;
}