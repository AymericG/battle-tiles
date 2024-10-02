import { Rotatable } from './Rotatable';

export enum AttackType {
  Melee = 'melee',
  Range = 'range',
}
export interface EdgeAttack {
  value: number;
  type: AttackType;
}

export interface Unit extends Rotatable {
  type: 'unit';
  attacks: EdgeAttack[];
  initiative: number;
}
