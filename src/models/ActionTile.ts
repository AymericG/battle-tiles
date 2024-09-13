import { Tile } from './Tile';

export class ActionTile implements Tile {
  id: number;
  type: 'action' = 'action';
  actionType: 'move' | 'attack' | 'special';
  description: string;

  constructor(id: number, actionType: 'move' | 'attack' | 'special', description: string) {
    this.id = id;
    this.actionType = actionType;
    this.description = description;
  }
}