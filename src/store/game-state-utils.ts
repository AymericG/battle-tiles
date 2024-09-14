import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../models/GameState";
import { Player } from "../models/Player";
import { GameObject } from "../models/GameObject";

export function playTileAsPlayer(tile: GameObject, row: number, col: number, state: Draft<GameState>) {
    console.log(`Player ${tile.playerId} plays ${tile.name} (${'rotation' in tile && tile.rotation}) on ${row}, ${col}.`);
    removeTileFromOriginContainer(state, tile);
    const targetCell = state.board[row][col];
    if (targetCell && targetCell.tiles) {
        targetCell.tiles.push(tile);
    } else {
        console.error(`Invalid cell at row ${row}, col ${col}`);
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