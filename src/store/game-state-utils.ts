import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../models/GameState";
import { Player } from "../models/Player";
import { GameObject } from "../models/GameObject";
import { EdgeAttack, Unit } from "../models/Unit";
import { AttackDirection } from "./types";
import { getFactionName } from "../utils/factions";
import { Module } from "../models/Module";
import { Rotatable } from "../models/Rotatable";

export function playTileAsPlayer(tile: GameObject, row: number, col: number, state: Draft<GameState>) {
    console.log(`Player ${tile.playerId} plays ${tile.name} (${'rotation' in tile && tile.rotation}) on ${col}, ${row}.`);
    removeTileFromOriginContainer(state, tile);
    const targetCell = state.board[row][col];
    if (targetCell && targetCell.tiles) {
        targetCell.tiles.push(tile);
    } else {
        console.error(`Invalid cell at ${col},${row}`);
    }
}

export function removeTileFromOriginContainer(state: Draft<GameState>, tile: GameObject) {
    const currentPlayer = state.players.find(x => x.id === tile.playerId);
    if (!currentPlayer) {
      console.error(`Player ${tile.playerId} not found`);
      return;
    }
    // Remove the tile from the current player's hand
    let tileIndex = currentPlayer.hand.findIndex((t: GameObject) => t.id === tile.id);
    if (tileIndex !== -1) {
      currentPlayer.hand.splice(tileIndex, 1);
      return;
    }
  
    tileIndex = currentPlayer.discardPile.findIndex((t: GameObject) => t.id === tile.id);
    if (tileIndex !== -1) {
      currentPlayer.discardPile.splice(tileIndex, 1);
      return;
    }
  
    tileIndex = currentPlayer.drawPile.findIndex((t: GameObject) => t.id === tile.id);
    if (tileIndex !== -1) {
      currentPlayer.drawPile.splice(tileIndex, 1);
      return;
    }
  
    // find tile in the board
    for (let row = 0; row < state.board.length; row++) {
        for (let col = 0; col < state.board[row].length; col++) {
        const cell = state.board[row][col];
        if (!cell || !cell.tiles) { continue; }
        const originalTile = cell.tiles.find((t: GameObject) => t.id === tile.id);
        if (originalTile) {
            cell.tiles.splice(cell.tiles.indexOf(originalTile), 1);
            return;
        }
      }
    }
  }

export function getPlayer(playerId: number, state: Draft<GameState>) {
    return state.players.find(x => x.id === playerId);
}

export function discardAsPlayer(player: Player | undefined, tile: GameObject, state: Draft<GameState>) {
    if (!player) { return; }
    console.log(`Player ${player.id} discards ${tile.name}.`);
    removeTileFromOriginContainer(state, tile);
    tile.playerId = player.id;
    if ('health' in tile && 'maxHealth' in tile) {
      tile.health = tile.maxHealth;
    }
    player.discardPile.push(tile);
}

export function drawTileAsPlayer(player: Player | undefined, state: Draft<GameState>) {
    if (!player) { 
      return; 
    }
    if (player.drawPile.length === 0) {
      console.log(`Player ${player.id} shuffles his/her discard pile to draw.`);
      player.drawPile = player.discardPile;
      player.discardPile = [];
    }
    const drawnTile = player.drawPile.pop();
    if (drawnTile) {
        player.hand.push(drawnTile);
    }
}

function findTilePosition(tile: GameObject, state: Draft<GameState>) {
    for (let row = 0; row < state.board.length; row++) {
      for (let col = 0; col < state.board[row].length; col++) {
        const cell = state.board[row][col];
        if (!cell || !cell.tiles) { continue; }
        const originalTile = cell.tiles.find((t: GameObject) => t.id === tile.id);
        if (originalTile) {
          return { row, col };
        }
      }
    }
    return null;
}

function findValidTarget(unit: Unit, edge: number, attack: EdgeAttack, state: Draft<GameState>) {
    const attackOrigin = findTilePosition(unit, state);
    if (!attackOrigin) {
      return null;
    }
    const attackDirection = (edge + unit.rotation as number) % 4;
    const enemyTiles = [];
    switch (attackDirection) {
      case AttackDirection.UP:
        if (attackOrigin.row === 0) { return null; }
        // Get all cells in the column above the unit until we reach the edge of the board
        for (let row = attackOrigin.row - 1; row >= 0; row--) {
          // if previous cell has a horizontal wall, break
          if (state.board[row + 1][attackOrigin.col].walls.includes('horizontal')) {
            break;
          }
          const target = state.board[row][attackOrigin.col];
          if (target.tiles) {
            const enemyTile = target.tiles.find(tile => (tile as Unit).playerId !== unit.playerId);
            if (enemyTile) { 
              enemyTiles.push(enemyTile); 
            }
          }
          if (attack.type === 'melee') {
            break;
          }
        }
        break;
      case AttackDirection.RIGHT:
        if (attackOrigin.col === state.board[0].length - 1) { return null; }
        // Get all cells in the row to the right of the unit until we reach the edge of the board
        for (let col = attackOrigin.col + 1; col < state.board[0].length; col++) {
          const target = state.board[attackOrigin.row][col];
          if (target.walls.includes('vertical')) {
            break;
          }
          if (target.tiles) {
            const enemyTile = target.tiles.find(tile => (tile as Unit).playerId !== unit.playerId);
            if (enemyTile) { 
              enemyTiles.push(enemyTile); 
            }
          }
          if (attack.type === 'melee') {
            break;
          }
        }
        break;
      case AttackDirection.DOWN:
        if (attackOrigin.row === state.board.length - 1) { return null; }
        // Get all cells in the column below the unit until we reach the edge of the board
        for (let row = attackOrigin.row + 1; row < state.board.length; row++) {
          const target = state.board[row][attackOrigin.col];
          if (state.board[row][attackOrigin.col].walls.includes('horizontal')) {
            break;
          }
          if (target.tiles) {
            const enemyTile = target.tiles.find(tile => (tile as Unit).playerId !== unit.playerId);
            if (enemyTile) { 
              enemyTiles.push(enemyTile); 
            }
          }
          if (attack.type === 'melee') {
            break;
          }
        }
        break;
      case AttackDirection.LEFT:
        if (attackOrigin.col === 0) { return null; }
        // Get all cells in the row to the left of the unit until we reach the edge of the board
        for (let col = attackOrigin.col - 1; col >= 0; col--) {
          const target = state.board[attackOrigin.row][col];
          if (state.board[attackOrigin.row][col + 1].walls.includes('vertical')) {
            break;
          }
          if (target.tiles) {
            const enemyTile = target.tiles.find(tile => (tile as Unit).playerId !== unit.playerId);
            if (enemyTile) { 
              enemyTiles.push(enemyTile); 
            }
          }
          if (attack.type === 'melee') {
            break;
          }
        }
        break;
    }
    if (enemyTiles.length === 0) {
      return null;
    }
    return enemyTiles[0];
}

function findValidAttackActions(unit: Unit, state: Draft<GameState>) {
    const attackActions = unit.attacks.map((attack, edge) => {
      const target = findValidTarget(unit, edge, attack, state);
      if (target) {
        return { unit, target, attack };
      }
      return null;
    }).filter(action => action !== null);
    return attackActions;
}

export function attack(attackAction: { unit: Unit, target: GameObject, attack: EdgeAttack }, state: Draft<GameState>) {
    const targetUnit = attackAction.target as Rotatable;
    targetUnit.health -= attackAction.attack.value;
    if (targetUnit.health <= 0) {
      const targetEnemyPlayer = state.players.find(player => player.id === targetUnit.playerId);
      console.log(`${getFactionName(attackAction.unit.faction)} ${attackAction.unit.name} kills ${getFactionName(targetUnit.faction)} ${targetUnit.name}.`);
      discardAsPlayer(targetEnemyPlayer, targetUnit, state);
    } else {
      console.log(`${getFactionName(attackAction.unit.faction)} ${attackAction.unit.name} deals ${attackAction.attack.value} damage to ${getFactionName(attackAction.target.faction)} ${attackAction.target.name}.`);
    }
}

export function battle(state: Draft<GameState>) {
    const possibleInitiatives = Array.from(Array(5).keys()).reverse();
    for (const initiative of possibleInitiatives) {
      // Find all units with the current initiative
      const units = state.board.flat().map(cell => cell.tiles).flat().filter(tile => 'initiative' in tile && tile.initiative === initiative);
      const allAttackActions = [];
      for (const unit of units) {
        if (unit.type !== 'unit') { continue; }
        const attackActions = findValidAttackActions(unit as Unit, state);
        allAttackActions.push(...attackActions);
      }

      for (const attackAction of allAttackActions) {
        if (!attackAction) { continue; }
        attack(attackAction, state);
      }
    }
}