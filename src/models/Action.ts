import { GameObject } from './GameObject';

export interface Action extends GameObject {
  type: 'action';
  actionType: 'move' | 'attack' | 'special';
  description: string;
}