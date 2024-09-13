import { GameState } from './models/GameState';
import { UnitTile } from './models/UnitTile';
import { ModuleTile } from './models/ModuleTile';
import { ActionTile } from './models/ActionTile';

// Initialize game state
export const initialGameState: GameState = {
    map: [
      [
        { x: 0, y: 0, tiles: [new UnitTile(1, [
          { value: 2, type: 'melee' },
          { value: 1, type: 'range' },
          { value: 3, type: 'melee' },
          { value: 0, type: 'melee' },
        ], 3, 1)] },
        { x: 1, y: 0, tiles: [new ModuleTile(2, "Shield")] },
        { x: 2, y: 0, tiles: [] },
        { x: 3, y: 0, tiles: [] },
      ],
      [
        { x: 0, y: 1, tiles: [] },
        { x: 1, y: 1, tiles: [new ActionTile(3, "move", "Move 2 spaces")] },
        { x: 2, y: 1, tiles: [] },
        { x: 3, y: 1, tiles: [] },
      ],
      [
        { x: 0, y: 2, tiles: [] },
        { x: 1, y: 2, tiles: [] },
        { x: 2, y: 2, tiles: [new ActionTile(4, "attack", "Deal 2 damage")] },
        { x: 3, y: 2, tiles: [] },
      ],
      [
        { x: 0, y: 3, tiles: [] },
        { x: 1, y: 3, tiles: [] },
        { x: 2, y: 3, tiles: [new ModuleTile(5, "Boost")] },
        { x: 3, y: 3, tiles: [new UnitTile(6, [
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
          new ActionTile(13, "attack", "Deal 1 damage"),
          new ModuleTile(14, "Armor"),
          new ActionTile(15, "move", "Move 1 space"),
        ],
        drawPile: [
          new ActionTile(7, "special", "Block 2 damage"),
          new ModuleTile(8, "Radar"),
          new ActionTile(16, "attack", "Deal 3 damage"),
          new ModuleTile(17, "Turret"),
          new ActionTile(18, "special", "Draw 1 card and deal 1 damage"),
        ],
        discardPile: [
          new ActionTile(9, "special", "Heal 1 HP"),
          new ModuleTile(19, "Engine"),
          new ActionTile(20, "move", "Move 3 spaces"),
        ]
      },
      { 
        id: 2, 
        name: 'Player 2', 
        hand: [
          new ActionTile(21, "attack", "Deal 2 damage"),
          new ModuleTile(22, "Cloak"),
          new ActionTile(23, "special", "Swap positions with an adjacent unit"),
        ],
        drawPile: [
          new ActionTile(10, "special", "Increase damage by 1"),
          new ModuleTile(11, "Stealth"),
          new ActionTile(24, "move", "Move 2 spaces diagonally"),
          new ModuleTile(25, "Scanner"),
          new ActionTile(26, "special", "Reflect next attack"),
        ],
        discardPile: [
          new ActionTile(12, "special", "Draw 2 cards"),
          new ModuleTile(27, "Shield Generator"),
          new ActionTile(28, "attack", "Deal 1 damage to all adjacent enemies"),
        ]
      },
    ],
    currentPlayerIndex: 0,
  };
