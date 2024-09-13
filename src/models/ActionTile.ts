import { Tile } from './Tile';

export interface ActionTile extends Tile {
  id: number;
  type: 'action';
  actionType: 'move' | 'attack' | 'special';
  description: string;
}