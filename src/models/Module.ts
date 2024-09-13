import { Rotatable } from './Rotatable';

export interface Module extends Rotatable {
  type: 'module';
  effect: string;
  id: number;
}