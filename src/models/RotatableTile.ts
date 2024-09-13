import { Tile } from './Tile';

export interface RotatableTile extends Tile {
  id: number;
  type: 'unit' | 'module';
  rotation: number;
}