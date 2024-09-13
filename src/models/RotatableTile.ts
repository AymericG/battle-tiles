import { Tile } from './Tile';

export abstract class RotatableTile implements Tile {
  id: number;
  abstract type: 'unit' | 'module';
  rotation: number;

  constructor(id: number, rotation: number = 0) {
    this.id = id;
    this.rotation = rotation;
  }
}