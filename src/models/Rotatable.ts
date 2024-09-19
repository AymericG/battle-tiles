import { GameObject, GameObjectInstance } from './GameObject';

export interface Rotatable extends GameObject {
  type: 'unit' | 'module';
  health: number;
}

export interface RotatableInstance extends GameObjectInstance {
  rotation: number;
  health: number;
}
