import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialGameState } from './initialGameState';
import { GameObject } from '../models/GameObject';
import { Rotatable } from '../models/Rotatable';

interface MoveTilePayload {
  tile: GameObject;
  row: number;
  col: number;
}

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    drawTile: (state, action: PayloadAction<{ playerIndex: number }>) => {
        const { playerIndex } = action.payload;
        const player = state.players[playerIndex];
        if (!player || !player.drawPile.length) { return; }
        const drawnTile = player.drawPile.pop();
        if (drawnTile) {
          player.hand.push(drawnTile);
        }
        // player.drawPile = remainingDrawPile.reverse();
      },
    moveTile: (state, action: PayloadAction<MoveTilePayload>) => {
      const { tile, row, col } = action.payload;
      const currentPlayer = state.players[state.currentPlayerIndex];

      // Remove the tile from the current player's hand
      currentPlayer.hand = currentPlayer.hand.filter((t: GameObject) => t.id !== tile.id);

      // Place the tile on the board
      const cell = state.board[row][col];
      if (cell && cell.tiles) {
        cell.tiles.push(tile);
      } else {
        console.error(`Invalid cell at row ${row}, col ${col}`);
      }

      // Switch to the next player
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
    },
    rotateTile: (state, action: PayloadAction<{ tileId: number }>) => {
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

export const { drawTile, moveTile, rotateTile } = gameSlice.actions;
export default gameSlice.reducer;