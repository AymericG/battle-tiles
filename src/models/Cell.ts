import { RotatableInstance } from './Rotatable';

export interface Cell {
  x: number;
  y: number;
  tiles: RotatableInstance[];
  walls: ('horizontal' | 'vertical')[];
}