import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { initialGameState } from './initialGameState';
import { GameObject } from '../models/GameObject';
import { Rotatable } from '../models/Rotatable';
import { GameState } from '../models/GameState';

interface MoveTilePayload {
  tile: GameObject;
  row: number;
  col: number;
}

function removeTileFromOriginContainer(state: Draft<GameState>, tile: GameObject) {
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

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    moveToHand: (state, action: PayloadAction<{ playerId: number; tile: GameObject }>) => {
      const { playerId, tile } = action.payload;

      removeTileFromOriginContainer(state, tile);
      const player = state.players.find(x => x.id === playerId);
      if (!player) {
        console.error(`Player ${playerId} not found`);
        return;
      }
      tile.playerId = playerId;
      player.hand.push(tile);
    },

    moveToDraw: (state, action: PayloadAction<{ playerId: number; tile: GameObject }>) => {
      const { playerId, tile } = action.payload;

      removeTileFromOriginContainer(state, tile);
      const player = state.players.find(x => x.id === playerId);
      if (!player) {
        console.error(`Player ${playerId} not found`);
        return;
      }
      tile.playerId = playerId;
      player.drawPile.push(tile);
    },
    moveToDiscard: (state, action: PayloadAction<{ playerId: number; tile: GameObject }>) => {
      const { playerId, tile } = action.payload;

      removeTileFromOriginContainer(state, tile);
      const player = state.players.find(x => x.id === playerId);
      if (!player) {
        console.error(`Player ${playerId} not found`);
        return;
      }
      tile.playerId = playerId;
      player.discardPile.push(tile);
    },
    drawTile: (state, action: PayloadAction<{ playerIndex: number }>) => {
        const { playerIndex } = action.payload;
        const player = state.players[playerIndex];
        if (!player || !player.drawPile.length) { return; }
        const drawnTile = player.drawPile.pop();
        if (drawnTile) {
          player.hand.push(drawnTile);
        }
      },
    moveTile: (state, action: PayloadAction<MoveTilePayload>) => {
      const { tile, row, col } = action.payload;
      
      removeTileFromOriginContainer(state, tile);

      // Place the tile on the board
      const targetCell = state.board[row][col];
      if (targetCell && targetCell.tiles) {
        targetCell.tiles.push(tile);
      } else {
        console.error(`Invalid cell at row ${row}, col ${col}`);
      }

      // Switch to the next player
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    },
    rotateTile: (state, action: PayloadAction<{ tileId: string }>) => {
      const { tileId } = action.payload;
        for (let row = 0; row < state.board.length; row++) {
            for (let col = 0; col < state.board[row].length; col++) {
            const cell = state.board[row][col];
            if (!cell || !cell.tiles) { continue; }
            const tile = cell.tiles.find((tile: GameObject) => tile.id === tileId);
            if (tile) {
                const rotatable = tile as Rotatable;
                const newRotation = (rotatable.rotation + 1) % 4;
                rotatable.rotation = newRotation < 0 ? 3 : newRotation;
            }
        }

      }
    },
  },
});

export const { drawTile, moveToDiscard, moveToDraw, moveToHand, moveTile, rotateTile } = gameSlice.actions;
export default gameSlice.reducer;