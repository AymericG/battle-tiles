import { AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialGameState } from './initialGameState';
import { GameObjectInstance } from '../models/GameObject';
import { RotatableInstance } from '../models/Rotatable';
import { playAs } from './ai';
import { battle, discardAsPlayer, drawTileAsPlayer, getPlayer, playTileAsPlayer, removeTileFromOriginContainer } from './game-state-utils';

interface BoardPayload {
  row: number;
  col: number;
}

interface MoveTilePayload extends BoardPayload {
  tile: GameObjectInstance;
}


const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    aiTurn: (state, action: PayloadAction<{ playerId: number }>) => {
      const { playerId } = action.payload;
      const player = getPlayer(playerId, state);
      playAs(player, state);
    },
    moveToHand: (state, action: PayloadAction<{ playerId: number; tile: GameObjectInstance }>) => {
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

    moveToDraw: (state, action: PayloadAction<{ playerId: number; tile: GameObjectInstance }>) => {
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
    moveToDiscard: (state, action: PayloadAction<{ playerId: number; tile: GameObjectInstance }>) => {
      const { playerId, tile } = action.payload;
      const player = getPlayer(playerId, state);
      discardAsPlayer(player, tile, state);
    },
    drawTile: (state, action: PayloadAction<{ playerId: number }>) => {
        const { playerId } = action.payload;
        const player = getPlayer(playerId, state);  
        drawTileAsPlayer(player, state);
      },
    moveTile: (state, action: PayloadAction<MoveTilePayload>) => {
      const { tile, row, col } = action.payload;
      playTileAsPlayer(tile as RotatableInstance, row, col, state);
    },
    addDamage: (state, action: PayloadAction<BoardPayload>) => {
      const { row, col } = action.payload;
      
      // Place the tile on the board
      const targetCell = state.board[row][col];
      if (targetCell && targetCell.tiles && targetCell.tiles.length) {
        (targetCell.tiles[targetCell.tiles.length - 1] as RotatableInstance).health--;
      }
    },
    rotateTile: (state, action: PayloadAction<{ tileId: string }>) => {
      const { tileId } = action.payload;
        for (let row = 0; row < state.board.length; row++) {
            for (let col = 0; col < state.board[row].length; col++) {
            const cell = state.board[row][col];
            if (!cell || !cell.tiles) { continue; }
            const tile = cell.tiles.find((tile: GameObjectInstance) => tile.id === tileId);
            if (tile) {
                const rotatable = tile as RotatableInstance;
                const newRotation = (rotatable.rotation + 1) % 4;
                rotatable.rotation = newRotation < 0 ? 3 : newRotation;
            }
        }

      }
    },
    resolveBattle: (state, action: AnyAction) => {
      battle(state);
    }
  },
});

export const { resolveBattle, aiTurn, addDamage, drawTile, moveToDiscard, moveToDraw, moveToHand, moveTile, rotateTile } = gameSlice.actions;
export default gameSlice.reducer;