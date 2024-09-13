import { GameState } from '../models/GameState';
import { AttackType, Unit } from '../models/Unit';
import { Module } from '../models/Module';
import { Action } from '../models/Action';
import { uuidv4 } from '../utils/uuid';
import { Faction } from '../models/Faction';

function createUnit(faction: Faction, attacks: { value: number, type: AttackType }[], health: number, initiative: number): Unit {
  return {
    id: uuidv4(),
    type: 'unit',
    faction,
    attacks,
    health,
    initiative,
    rotation: 0,
  };
}

function createModule(faction: Faction, effect: string): Module {
  return {
    id: uuidv4(),
    type: 'module',
    faction,
    effect,
    rotation: 0,
  };
}

function createAction(faction: Faction, actionType: 'move' | 'attack' | 'special', description: string): Action {
  return {
    id: uuidv4(),
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
        x: 0, y: 0, tiles: [createUnit(Faction.SpaceWolves,
          [
            { value: 2, type: 'melee' },
            { value: 1, type: 'range' },
            { value: 3, type: 'melee' },
            { value: 0, type: 'melee' },
          ], 3, 1)]
      },
      { x: 1, y: 0, tiles: [createModule(Faction.SpaceWolves, "Shield")] },
      { x: 2, y: 0, tiles: [] },
      { x: 3, y: 0, tiles: [] },
    ],
    [
      { x: 0, y: 1, tiles: [] },
      {
        x: 1, y: 1, tiles: [createUnit(Faction.SpaceWolves, [
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
        x: 2, y: 2, tiles: [createUnit(Faction.SpaceWolves, [
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
      { x: 2, y: 3, tiles: [createModule(Faction.Orks, "Boost")] },
      {
        x: 3, y: 3, tiles: [createUnit(Faction.Orks, [
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
        createAction(Faction.SpaceWolves, "attack", "Deal 1 damage"),
        createModule(Faction.SpaceWolves, "Armor"),
        createAction(Faction.SpaceWolves, "move", "Move 1 space"),
      ],
      drawPile: [
        createAction(Faction.SpaceWolves, "special", "Block 2 damage"),
        createModule(Faction.SpaceWolves, "Radar"),
        createAction(Faction.SpaceWolves, "attack", "Deal 3 damage"),
        createModule(Faction.SpaceWolves, "Turret"),
        createAction(Faction.SpaceWolves, "special", "Draw 1 card and deal 1 damage"),
      ],
      discardPile: [
        createAction(Faction.SpaceWolves, "special", "Heal 1 HP"),
        createModule(Faction.SpaceWolves, "Engine"),
        createAction(Faction.SpaceWolves, "move", "Move 3 spaces"),
      ]
    },
    {
      id: 2,
      name: 'Player 2',
      hand: [
        createAction(Faction.Orks, "attack", "Deal 2 damage"),
        createModule(Faction.Orks, "Cloak"),
        createAction(Faction.Orks, "special", "Swap positions with an adjacent unit"),
      ],
      drawPile: [
        createAction(Faction.Orks, "special", "Increase damage by 1"),
        createModule(Faction.Orks, "Stealth"),
        createAction(Faction.Orks, "move", "Move 2 spaces diagonally"),
        createModule(Faction.Orks, "Scanner"),
        createAction(Faction.Orks, "special", "Reflect next attack"),
      ],
      discardPile: [
        createAction(Faction.Orks, "special", "Draw 2 cards"),
        createModule(Faction.Orks, "Shield Generator"),
        createAction(Faction.Orks, "attack", "Deal 1 damage to all adjacent enemies"),
      ]
    },
  ],
  currentPlayerIndex: 0,
};
