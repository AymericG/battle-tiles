import { GameObject } from './GameObject';

export interface Player {
  id: number;
  name: string;
  hand: GameObject[];
  drawPile: GameObject[];
  discardPile: GameObject[];
}