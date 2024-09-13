import { GameObject } from './GameObject';

export interface Action extends GameObject {
  id: number;
  type: 'action';
  actionType: 'move' | 'attack' | 'special';
  description: string;
}