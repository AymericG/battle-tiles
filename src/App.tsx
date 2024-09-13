import React from 'react';
import './App.css';
import { GameState } from './models/GameState';
import { CellComponent } from './components/CellComponent';
import { UnitTile } from './models/UnitTile';
import { ModuleTile } from './models/ModuleTile';
import { ActionTile } from './models/ActionTile';
import { PlayerPiles } from './components/PlayerPiles';

// Initialize game state
const initialGameState: GameState = {
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
      hand: [],
      drawPile: [new ActionTile(7, "special", "Block 2 damage"), new ModuleTile(8, "Radar")],
      discardPile: [new ActionTile(9, "special", "Heal 1 HP")]
    },
    { 
      id: 2, 
      name: 'Player 2', 
      hand: [],
      drawPile: [new ActionTile(10, "special", "Increase damage by 1"), new ModuleTile(11, "Stealth")],
      discardPile: [new ActionTile(12, "special", "Draw 2 cards")]
    },
  ],
  currentPlayerIndex: 0,
};

function App() {
  const [gameState, setGameState] = React.useState<GameState>(initialGameState);

  return (
    <div className="App">
      <div className="game-container">
        <PlayerPiles player={gameState.players[1]} side="left" />
        <div className="grid">
          {gameState.map.map((row, y) =>
            row.map((cell, x) => (
              <CellComponent key={`${x}-${y}`} cell={cell} />
            ))
          )}
        </div>
        <PlayerPiles player={gameState.players[0]} side="right" />
      </div>
    </div>
  );
}

export default App;
