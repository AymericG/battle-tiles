import { Ability } from '../store/types';
import { Rotatable } from './Rotatable';

export interface Module extends Rotatable {
  type: 'module';
  abilities: Ability[];
  connected: boolean[];
}