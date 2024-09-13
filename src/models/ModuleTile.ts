import { RotatableTile } from './RotatableTile';

export class ModuleTile extends RotatableTile {
  type: 'module' = 'module';
  effect: string;

  constructor(id: number, effect: string, rotation: number = 0) {
    super(id, rotation);
    this.effect = effect;
  }
}