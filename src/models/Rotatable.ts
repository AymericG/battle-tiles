import { GameObject } from './GameObject';

export interface Rotatable extends GameObject {
  type: 'unit' | 'module';
  rotation: number;
}