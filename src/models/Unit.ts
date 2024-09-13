import { Rotatable } from './Rotatable';

export type AttackType = 'melee' | 'range';

export interface EdgeAttack {
  value: number;
  type: AttackType;
}

export interface Unit extends Rotatable {
  type: 'unit';
  attacks: EdgeAttack[];
  health: number;
  initiative: number;
}
