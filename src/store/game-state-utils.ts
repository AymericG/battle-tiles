import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../models/GameState";
import { Player } from "../models/Player";
import { GameObjectInstance } from "../models/GameObject";
import { AttackType, EdgeAttack, Unit } from "../models/Unit";
import { getFactionName } from "../utils/factions";
import { Rotatable, RotatableInstance } from "../models/Rotatable";
import { allGameObjects } from "./all-game-objects";
import { log } from "../utils/log";
import { BOARD_SIZE, LEADER_UNIT } from "../constants";
import { findEnemiesInDirection } from "./board-manipulation";
import { Module } from "../models/Module";
import { Ability, GameEvent } from "./types";
import { IPosition } from "../models/IPosition";
import { time } from "console";

export function playTileAsPlayer(tile: RotatableInstance, row: number, col: number, state: Draft<GameState>) {
  log(`Player ${tile.playerId} plays ${allGameObjects[tile.objectId].name} (${'rotation' in tile && tile.rotation}) on ${col}, ${row}.`);
  removeTileFromOriginContainer(state, tile);
  const targetCell = state.board[row][col];
  if (targetCell && targetCell.tiles) {
    targetCell.tiles.push(tile);

    // If there are no empty cells anymore, start the battle
    const emptyCells = state.board.flat().map(cell => cell.tiles.length ? null : cell).filter(x => x);
    if (emptyCells.length === 0) {
      battle(state);
    }
  } else {
    console.error(`Invalid cell at ${col},${row}`);
  }
}

function removeFromContainer(container: GameObjectInstance[], tile: GameObjectInstance) {
  const tileIndex = container.findIndex(t => t.id === tile.id);
  if (tileIndex !== -1) {
    container.splice(tileIndex, 1);
    return true;
  }
  return false;
}

export function removeTileFromOriginContainer(state: Draft<GameState>, tile: GameObjectInstance) {
  const currentPlayer = state.players.find(x => x.id === tile.playerId);
  if (!currentPlayer) {
    return;
  }

  if (removeFromContainer(currentPlayer.hand, tile)) {
    return;
  }
  if (removeFromContainer(currentPlayer.discardPile, tile)) {
    return;
  }
  if (removeFromContainer(currentPlayer.drawPile, tile)) {
    return;
  }

  // find tile in the board
  for (let row = 0; row < state.board.length; row++) {
    for (let col = 0; col < state.board[row].length; col++) {
      const cell = state.board[row][col];
      if (removeFromContainer(cell.tiles, tile)) {
        return;
      }
    }
  }
}

export function getPlayer(playerId: number, state: Draft<GameState>) {
  return state.players.find(x => x.id === playerId);
}

export function discardAsPlayer(playerId: number, tile: GameObjectInstance, state: Draft<GameState>) {
  log(`Player ${playerId} discards ${allGameObjects[tile.objectId].name}.`);
  removeTileFromOriginContainer(state, tile);
  tile.playerId = playerId;
  const tileTemplate = allGameObjects[tile.objectId];
  if (tileTemplate.type === 'unit' || tileTemplate.type === 'module') {
    (tile as RotatableInstance).health = tileTemplate.health;
    (tile as RotatableInstance).rotation = 0;
  }
  const player = getPlayer(playerId, state);
  if (player && tileTemplate.type === 'unit' && tileTemplate.name === LEADER_UNIT) {
    log(`Player ${playerId} loses its leader.`);
    player.lost = true;
  }
  player?.discardPile.push(tile);
}

export function drawTileAsPlayer(player: Player | undefined, state: Draft<GameState>) {
  if (!player) {
    return;
  }
  if (player.drawPile.length === 0) {
    log(`Player ${player.id} shuffles his/her discard pile to draw.`);
    player.drawPile = player.discardPile;
    player.discardPile = [];
  }
  const drawnTile = player.drawPile.pop();
  if (drawnTile) {
    player.hand.push(drawnTile);
  }
}

export function findTilePosition(tile: GameObjectInstance | undefined, state: Draft<GameState>): IPosition | null {
  if (!tile) { return null; }
  for (let row = 0; row < state.board.length; row++) {
    for (let col = 0; col < state.board[row].length; col++) {
      const cell = state.board[row][col];
      if (!cell || !cell.tiles) { continue; }
      const originalTile = cell.tiles.find(t => t.id === tile.id);
      if (originalTile) {
        return { y: row, x: col };
      }
    }
  }
  return null;
}

function findValidAttackTarget(unit: RotatableInstance, edge: number, attack: EdgeAttack, state: Draft<GameState>) {
  const attackOrigin = findTilePosition(unit, state);
  if (!attackOrigin) {
    return null;
  }
  const attackDirection = (edge + unit.rotation as number) % 4;

  const enemyTiles = findEnemiesInDirection({
    x: attackOrigin.x,
    y: attackOrigin.y,
    direction: attackDirection,
    range: attack.type === AttackType.Melee ? 1 : BOARD_SIZE,
    playerId: unit.playerId,
    state
  });

  if (enemyTiles.length === 0) {
    return null;
  }
  // If two range units are shooting the same column
  // They would both hit the same target
  // TODO: Instead of hitting the same target twice, they should hit two different targets
  return enemyTiles[0];
}

function findValidAttackActions(unit: RotatableInstance, state: Draft<GameState>) {
  const unitTemplate = allGameObjects[unit.objectId] as Unit;
  const attackActions = unitTemplate.attacks.map((attack, edge) => {
    const target = findValidAttackTarget(unit, edge, attack, state);
    if (target) {
      return { unit, target, attack };
    }
    return null;
  }).filter(action => action !== null);
  return attackActions;
}

export function moveTileToHand(tile: GameObjectInstance, playerId: number, state: Draft<GameState>) {
  removeTileFromOriginContainer(state, tile);
  const player = state.players.find(x => x.id === playerId);
  if (!player) {
    console.error(`Player ${playerId} not found`);
    return;
  }
  tile.playerId = playerId;
  const tileTemplate = allGameObjects[tile.objectId];
  if (tileTemplate.type === 'unit' || tileTemplate.type === 'module') {
    (tile as RotatableInstance).health = tileTemplate.health;
    (tile as RotatableInstance).rotation = 0;
  }

  player.hand.push(tile);
}

function handleEvent({
  gameEvent,
  defaultEffect, 
  targetUnit,
  state
} : { gameEvent: GameEvent; defaultEffect: () => void; targetUnit: RotatableInstance; state: Draft<GameState>}) {
  const triggeredAbilities = state.board.flat()
    .flatMap(cell => cell.tiles)
    .flatMap(tile => {
      const template = allGameObjects[tile.objectId] as Rotatable;
      if (template.type !== 'module') { return null; }
      const module = template as Module;
      return module.abilities.filter((ability: Ability) => ability.event === gameEvent).map(ability => ({
        ability,
        tile
      }));
    }).filter(x => x !== null);
  const effects = [defaultEffect];
  for (const triggeredAbility of triggeredAbilities) {
    if (!triggeredAbility) { continue; }
    triggeredAbility.ability.execute(triggeredAbility.tile, targetUnit, state, effects);
  }
  // Execute all effects
  effects.forEach(effect => effect());  
}

export function attack(attackAction: { unit: RotatableInstance, target: RotatableInstance, attack: EdgeAttack }, state: Draft<GameState>) {
  const targetUnit = attackAction.target;
  log(`Attacking ${targetUnit.id} (health: ${targetUnit.health}) with ${attackAction.attack.value} damage.`);
  handleEvent({ 
    gameEvent: GameEvent.DAMAGED, 
    targetUnit,
    state,
    defaultEffect: () => { 
      log(`${targetUnit.id} takes ${attackAction.attack.value} damage.`);
      targetUnit.health -= attackAction.attack.value; 
    }});
  
  const unitTemplate = allGameObjects[attackAction.unit.objectId] as Rotatable;
  const targetUnitTemplate = allGameObjects[targetUnit.objectId] as Rotatable;
  if (targetUnit.health > 0) {
    log(`${getFactionName(unitTemplate.faction)} ${unitTemplate.name} deals ${attackAction.attack.value} damage to ${getFactionName(targetUnitTemplate.faction)} ${targetUnitTemplate.name}.`);
    return;
  }

  handleEvent({ 
    gameEvent: GameEvent.DESTROYED, 
    targetUnit,
    state,
    defaultEffect: () => {
    log(`${getFactionName(unitTemplate.faction)} ${unitTemplate.name} kills ${getFactionName(targetUnitTemplate.faction)} ${targetUnitTemplate.name}.`);
    discardAsPlayer(targetUnit.playerId, targetUnit, state);
  }});
  return state.players.some(p => p.lost);
}

export function battle(state: Draft<GameState>) {
  log('-- [Battle phase] --');
  const possibleInitiatives = Array.from(Array(5).keys()).reverse();
  for (const initiative of possibleInitiatives) {
    // Find all units with the current initiative
    const units = state.board.flat().map(cell => cell.tiles).flat().filter(tile => {
      const template = allGameObjects[tile.objectId] as Rotatable;
      return 'initiative' in template && template.initiative === initiative;
    });
    const allAttackActions = [];

    for (const unit of units) {
      const rotatable = allGameObjects[unit.objectId] as Rotatable;
      if (rotatable.type !== 'unit') { continue; }
      const attackActions = findValidAttackActions(unit, state);
      allAttackActions.push(...attackActions);
    }
    log(`Initiative ${initiative}: ${units.length} units, valid attack actions: `, allAttackActions);
    for (const attackAction of allAttackActions) {
      if (!attackAction) { continue; }
      const gameOver = attack(attackAction, state);
      if (gameOver) {
        return;
      }
    }
  }
}