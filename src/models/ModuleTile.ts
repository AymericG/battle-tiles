import { RotatableTile } from './RotatableTile';

export interface ModuleTile extends RotatableTile {
  type: 'module';
  effect: string;
  id: number;
}