import { GameState } from '../models/GameState';
import { createTauArmy } from './tau';
import { createOrkArmy } from './ork';
import { Faction } from '../models/Faction';

const tauArmy = createTauArmy(1);
const orkArmy = createOrkArmy(2);
// Initialize game state
export const initialGameState: GameState = {
  board: [
    [
      {
        x: 0, y: 0, tiles: [tauArmy.base]
      },
      { x: 1, y: 0, tiles: [] },
      { x: 2, y: 0, tiles: [] },
      { x: 3, y: 0, tiles: [] },
    ],
    [
      { x: 0, y: 1, tiles: [] },
      {
        x: 1, y: 1, tiles: []
      },
      { x: 2, y: 1, tiles: [] },
      { x: 3, y: 1, tiles: [] },
    ],
    [
      { x: 0, y: 2, tiles: [] },
      { x: 1, y: 2, tiles: [] },
      {
        x: 2, y: 2, tiles: []
      },
      { x: 3, y: 2, tiles: [] },
    ],
    [
      { x: 0, y: 3, tiles: [] },
      { x: 1, y: 3, tiles: [] },
      { x: 2, y: 3, tiles: [] },
      {
        x: 3, y: 3, tiles: [orkArmy.base]
      },
    ],
  ],
  players: [
    {
      id: 1,
      name: 'Tau player',
      faction: Faction.Tau,
      hand: [],
      drawPile: tauArmy.deck,
      discardPile: []
    },
    {
      id: 2,
      name: 'Ork player',
      faction: Faction.Orks,
      hand: [],
      drawPile: orkArmy.deck,
      discardPile: []
    },
  ],
  currentPlayerIndex: 0,
};
