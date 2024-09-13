import { RotatableTile } from './RotatableTile';

export type AttackType = 'melee' | 'range';

export interface EdgeAttack {
  value: number;
  type: AttackType;
}

export interface UnitTile extends RotatableTile {
  type: 'unit';
  attacks: EdgeAttack[];
  health: number;
  initiative: number;
}
