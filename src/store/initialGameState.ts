import { GameState } from '../models/GameState';
import { AttackType, Unit } from '../models/Unit';
import { Module } from '../models/Module';
import { Action } from '../models/Action';
import { uuidv4 } from '../utils/uuid';
import { Faction } from '../models/Faction';

function createUnit(playerId: number, faction: Faction, attacks: { value: number, type: AttackType }[], health: number, initiative: number): Unit {
  return {
    id: uuidv4(),
    playerId,
    type: 'unit',
    faction,
    attacks,
    health,
    initiative,
    rotation: 0,
  };
}

function createModule(playerId: number, faction: Faction, effect: string): Module {
  return {
    id: uuidv4(),
    playerId,
    type: 'module',
    faction,
    effect,
    rotation: 0,
    connected: [true, true, true, true],
  };
}

function createAction(playerId: number, faction: Faction, actionType: 'move' | 'attack' | 'special', description: string): Action {
  return {
    id: uuidv4(),
    playerId,
    faction,
    type: 'action',
    actionType,
    description
  };
}

// Initialize game state
export const initialGameState: GameState = {
  board: [
    [
      {
        x: 0, y: 0, tiles: [createUnit(1, Faction.SpaceWolves,
          [
            { value: 2, type: 'melee' },
            { value: 1, type: 'range' },
            { value: 3, type: 'melee' },
            { value: 0, type: 'melee' },
          ], 3, 1)]
      },
      { x: 1, y: 0, tiles: [createModule(1, Faction.SpaceWolves, "Shield")] },
      { x: 2, y: 0, tiles: [] },
      { x: 3, y: 0, tiles: [] },
    ],
    [
      { x: 0, y: 1, tiles: [] },
      {
        x: 1, y: 1, tiles: [createUnit(1, Faction.SpaceWolves, [
          { value: 3, type: 'range' },
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 2, type: 'melee' },
        ], 2, 2)]
      },
      { x: 2, y: 1, tiles: [] },
      { x: 3, y: 1, tiles: [] },
    ],
    [
      { x: 0, y: 2, tiles: [] },
      { x: 1, y: 2, tiles: [] },
      {
        x: 2, y: 2, tiles: [createUnit(1, Faction.SpaceWolves, [
          { value: 3, type: 'range' },
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 2, type: 'melee' },
        ], 2, 2)]
      },
      { x: 3, y: 2, tiles: [] },
    ],
    [
      { x: 0, y: 3, tiles: [] },
      { x: 1, y: 3, tiles: [] },
      { x: 2, y: 3, tiles: [createModule(2, Faction.Orks, "Boost")] },
      {
        x: 3, y: 3, tiles: [createUnit(2, Faction.Orks, [
          { value: 3, type: 'range' },
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 2, type: 'melee' },
        ], 2, 2)]
      },
    ],
  ],
  players: [
    {
      id: 1,
      name: 'Player 1',
      hand: [
        createAction(1, Faction.SpaceWolves, "attack", "Deal 1 damage"),
        createModule(1, Faction.SpaceWolves, "Armor"),
        createAction(1, Faction.SpaceWolves, "move", "Move 1 space"),
      ],
      drawPile: [
        createAction(1, Faction.SpaceWolves, "special", "Block 2 damage"),
        createModule(1, Faction.SpaceWolves, "Radar"),
        createAction(1, Faction.SpaceWolves, "attack", "Deal 3 damage"),
        createModule(1, Faction.SpaceWolves, "Turret"),
        createAction(1, Faction.SpaceWolves, "special", "Draw 1 card and deal 1 damage"),
      ],
      discardPile: [
        createAction(1, Faction.SpaceWolves, "special", "Heal 1 HP"),
        createModule(1, Faction.SpaceWolves, "Engine"),
        createAction(1, Faction.SpaceWolves, "move", "Move 3 spaces"),
      ]
    },
    {
      id: 2,
      name: 'Player 2',
      hand: [
        createAction(2, Faction.Orks, "attack", "Deal 2 damage"),
        createModule(2, Faction.Orks, "Cloak"),
        createAction(2, Faction.Orks, "special", "Swap positions with an adjacent unit"),
      ],
      drawPile: [
        createAction(2, Faction.Orks, "special", "Increase damage by 1"),
        createModule(2, Faction.Orks, "Stealth"),
        createAction(2, Faction.Orks, "move", "Move 2 spaces diagonally"),
        createModule(2, Faction.Orks, "Scanner"),
        createAction(2, Faction.Orks, "special", "Reflect next attack"),
      ],
      discardPile: [
        createAction(2, Faction.Orks, "special", "Draw 2 cards"),
        createModule(2, Faction.Orks, "Shield Generator"),
        createAction(2, Faction.Orks, "attack", "Deal 1 damage to all adjacent enemies"),
      ]
    },
  ],
  currentPlayerIndex: 0,
};
