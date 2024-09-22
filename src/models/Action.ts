import { GameObject } from './GameObject';

export interface Action extends GameObject {
  type: 'action';
  actionType: 'move' | 'attack' | 'special' | 'push';
  description: string;
}

// class ActionTarget {
//   // enemy or ally
//   // range, or any
//   // single or multiple
//   // self or other
//   // random or chosen
// }


// class MoveAction {

//   // AbilityOrigin = any.single.friendly.chosen
//   // AbilityEffect = move
//   // AbilityTargetTile = self
//   // AbilityTarget = 1.empty.cell.in.any.direction
  
// }

// class MadDokSurgeryAbility {
//   // Trigger = adjacent.single.friendly.destroyed
//   // Effect = move.to.hand
// }

// class CompositeAction {
//   actions: Action[];
// }

// class WAAAGHAction : CompositeAction {
//   actions = [
//     Move,
//     Move(except(previous)),
//     Move(except(previous),
//     Battle
//     // Move up to three of your units to adjacent empty tiles and immediately trigger a battle.
//     // AbilityOrigin = global
//     // AbilityEffect = move
//     // AbilityTargetTile = any.3.friendly.chosen


//   ]
//   // AbilityTargetDestination = any.adjacent.empty.cell
// }

// class PushAction {
//   // AbilityOrigin = any.single.friendly.chosen
//   // AbilityEffect = move
//   // AbilityTargetTile = any.adjacent.enemy.chosen
//   // AbilityTargetDestination = 1.empty.cell.in.same.direction
// }