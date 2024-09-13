import { Cell } from './Cell';
import { Player } from './Player';

export interface GameState {
  map: Cell[][];
  players: Player[];
  currentPlayerIndex: number;
}