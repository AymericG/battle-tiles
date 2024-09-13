import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../models/GameState';
import { initialGameState } from '../initialGameState';

const gameSlice = createSlice({
  name: 'game',
  initialState: initialGameState,
  reducers: {
    updateGameState: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    },
  },
});

export const { updateGameState } = gameSlice.actions;
export default gameSlice.reducer;