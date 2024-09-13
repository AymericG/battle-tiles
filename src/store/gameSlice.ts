import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialGameState } from '../initialGameState';
import { Tile } from '../models/Tile';

interface MoveTilePayload {
  tile: Tile;
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
        console.log('draw pile', player.drawPile);
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
      currentPlayer.hand = currentPlayer.hand.filter(t => t.id !== tile.id);

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
  },
});

export const { drawTile, moveTile } = gameSlice.actions;
export default gameSlice.reducer;