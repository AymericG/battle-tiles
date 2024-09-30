import { Cell } from './Cell';
import { Player } from './Player';

export interface GameState {
  board: Cell[][];
  players: Player[];
}