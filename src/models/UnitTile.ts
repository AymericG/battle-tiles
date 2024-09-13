import { RotatableTile } from './RotatableTile';

type AttackType = 'melee' | 'range';

interface EdgeAttack {
  value: number;
  type: AttackType;
}

export class UnitTile extends RotatableTile {
  type: 'unit' = 'unit';
  attacks: EdgeAttack[];
  health: number;
  initiative: number;

  constructor(
    id: number, 
    attacks: EdgeAttack[], 
    health: number, 
    initiative: number, 
    rotation: number = 0
  ) {
    super(id, rotation);
    this.attacks = attacks;
    this.health = health;
    this.initiative = initiative;
  }

  getAttackForEdge(edge: number): EdgeAttack {
    console.log('edge', edge, 'rotation', this.rotation, 'result', (edge + this.rotation) % 4);
    return this.attacks[(edge + this.rotation) % 4];
  }
}