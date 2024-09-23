import { GameState } from '../models/GameState';
import { BOARD_SIZE } from '../constants';
import { WallDirection } from './types';
import { Cell } from '../models/Cell';
import { createTauArmy } from './tau/create-army';
import { createOrkArmy } from './ork/create-army';
import { createSpaceWolvesArmy } from './spacewolves/create-army';

const tauArmy = createTauArmy(1);
const orkArmy = createOrkArmy(2);
// const spaceWolvesArmy = createSpaceWolvesArmy(2);

export interface Wall {
  x: number;
  y: number;
  direction: WallDirection;
}

function generateAllPossibleWalls() {
  const walls = [];
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      if (x !== 0) {
        walls.push({ x, y, direction: WallDirection.VERTICAL } as Wall);
      }
      if (y !== 0) {
        walls.push({ x, y, direction: WallDirection.HORIZONTAL } as Wall);
      }
    }
  }
  return walls;
}

const allPossibleWalls = generateAllPossibleWalls();
// Pick three random walls
const randomWalls = allPossibleWalls.sort(() => Math.random() - 0.5).slice(0, BOARD_SIZE - 1);

function generateWallArray(x: number, y: number, possibleWalls: Wall[]) {
  const walls = [];
  for (const wall of possibleWalls) {
    if (wall.x === x && wall.y === y) {
      walls.push(wall.direction);
    }
  }
  return walls;
}

function generateEmptyBoardCells() {
  const board = [];
  for (let y = 0; y < BOARD_SIZE; y++) {
    const row = [];
    for (let x = 0; x < BOARD_SIZE; x++) {
      row.push({ x, y, tiles: [], walls: generateWallArray(x, y, randomWalls) } as Cell);
    }
    board.push(row);
  }
  return board;
}

const board = generateEmptyBoardCells();
board[0][0].tiles = [tauArmy.base];
board[BOARD_SIZE - 1][BOARD_SIZE - 1].tiles = [orkArmy.base];

// Initialize game state
export const initialGameState: GameState = {
  board,
  players: [
    {
      id: 1,
      name: 'Tau player',
      faction: tauArmy.faction,
      hand: [],
      drawPile: tauArmy.deck,
      discardPile: []
    },
    {
      id: 2,
      name: 'Ork player',
      faction: orkArmy.faction,
      hand: [],
      drawPile: orkArmy.deck,
      discardPile: []
    },
  ],
  currentPlayerIndex: 0,
};
