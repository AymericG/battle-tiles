import { GameObject } from './GameObject';

export interface Rotatable extends GameObject {
  id: number;
  type: 'unit' | 'module';
  rotation: number;
}