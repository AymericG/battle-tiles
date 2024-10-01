import { GameState } from '../models/GameState';
import { BOARD_SIZE } from '../constants';
import { WallDirection } from './types';
import { Cell } from '../models/Cell';
import { createTauArmy } from './tau/create-army';
import { createOrkArmy } from './ork/create-army';
import { createSpaceWolvesArmy } from './spacewolves/create-army';
import { shuffle } from './army-utils';

const tauArmy = createTauArmy(1);
const orkArmy = createOrkArmy(2);
const spaceWolvesArmy = createSpaceWolvesArmy(2);

const armies = [tauArmy, orkArmy];

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
board[0][0].tiles = [armies[0].base];
board[BOARD_SIZE - 1][BOARD_SIZE - 1].tiles = [armies[1].base];


// Initialize game state
function createPlayer(id: number, army: any) {
  return {
    id,
    name: army.faction + ' player',
    faction: army.faction,
    hand: [],
    drawPile: shuffle([...army.deck]),
    discardPile: [],
    lost: false,
  };
}

export function createInitialState() {
  return {
    isAutoPlaying: false,
    board,
    players: [
      createPlayer(1, armies[0]),
      createPlayer(2, armies[1]),
    ]
  };
}

