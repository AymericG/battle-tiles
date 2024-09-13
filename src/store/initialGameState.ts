import { GameState } from '../models/GameState';
import { AttackType, UnitTile } from '../models/UnitTile';
import { ModuleTile } from '../models/ModuleTile';
import { ActionTile } from '../models/ActionTile';

function createUnit(id: number, attacks: { value: number, type: AttackType }[], health: number, initiative: number): UnitTile {
  return {
    id,
    type: 'unit',
    attacks,
    health,
    initiative,
    rotation: 0,
  };
}

function createModule(id: number, effect: string): ModuleTile {
  return {
    id,
    type: 'module',
    effect,
    rotation: 0,
  };
}

function createAction(id: number, actionType: 'move' | 'attack' | 'special', description: string): ActionTile {
  return {
    id,
    type: 'action',
    actionType,
    description
  };
}

// Initialize game state
export const initialGameState: GameState = {
    board: [
      [
        { x: 0, y: 0, tiles: [createUnit(1,
          [
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 3, type: 'melee' },
          { value: 0, type: 'melee' },
        ], 3, 1)] },
        { x: 1, y: 0, tiles: [createModule(2, "Shield")] },
        { x: 2, y: 0, tiles: [] },
        { x: 3, y: 0, tiles: [] },
      ],
      [
        { x: 0, y: 1, tiles: [] },
        { x: 1, y: 1, tiles: [createUnit(3, [
          { value: 3, type: 'range' },
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 2, type: 'melee' },
        ], 2, 2)] },
        { x: 2, y: 1, tiles: [] },
        { x: 3, y: 1, tiles: [] },
      ],
      [
        { x: 0, y: 2, tiles: [] },
        { x: 1, y: 2, tiles: [] },
        { x: 2, y: 2, tiles: [createUnit(4, [
          { value: 3, type: 'range' },
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 2, type: 'melee' },
        ], 2, 2)] },
        { x: 3, y: 2, tiles: [] },
      ],
      [
        { x: 0, y: 3, tiles: [] },
        { x: 1, y: 3, tiles: [] },
        { x: 2, y: 3, tiles: [createModule(5, "Boost")] },
        { x: 3, y: 3, tiles: [createUnit(6, [
          { value: 3, type: 'range' },
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 2, type: 'melee' },
        ], 2, 2)] },
      ],
    ],
    players: [
      { 
        id: 1, 
        name: 'Player 1', 
        hand: [
          createAction(13, "attack", "Deal 1 damage"),
          createModule(14, "Armor"),
          createAction(15, "move", "Move 1 space"),
        ],
        drawPile: [
          createAction(7, "special", "Block 2 damage"),
          createModule(8, "Radar"),
          createAction(16, "attack", "Deal 3 damage"),
          createModule(17, "Turret"),
          createAction(18, "special", "Draw 1 card and deal 1 damage"),
        ],
        discardPile: [
          createAction(9, "special", "Heal 1 HP"),
          createModule(19, "Engine"),
          createAction(20, "move", "Move 3 spaces"),
        ]
      },
      { 
        id: 2, 
        name: 'Player 2', 
        hand: [
          createAction(21, "attack", "Deal 2 damage"),
          createModule(22, "Cloak"),
          createAction(23, "special", "Swap positions with an adjacent unit"),
        ],
        drawPile: [
          createAction(10, "special", "Increase damage by 1"),
          createModule(11, "Stealth"),
          createAction(24, "move", "Move 2 spaces diagonally"),
          createModule(25, "Scanner"),
          createAction(26, "special", "Reflect next attack"),
        ],
        discardPile: [
          createAction(12, "special", "Draw 2 cards"),
          createModule(27, "Shield Generator"),
          createAction(28, "attack", "Deal 1 damage to all adjacent enemies"),
        ]
      },
    ],
    currentPlayerIndex: 0,
  };
