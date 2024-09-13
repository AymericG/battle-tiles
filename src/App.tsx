import React from 'react';
import './App.css';
import { GameState } from './models/GameState';
import { CellComponent } from './components/CellComponent';
import { PlayerPiles } from './components/PlayerPiles';
import { initialGameState } from './initialGameState';

function App() {
  const [gameState, setGameState] = React.useState<GameState>(initialGameState);

  return (
    <div className="App">
      <div className="game-container">
        <PlayerPiles 
          player={gameState.players[1]} 
          side="left" 
          showHand={true}
        />
        <div className="grid">
          {gameState.map.map((row, y) =>
            row.map((cell, x) => (
              <CellComponent key={`${x}-${y}`} cell={cell} />
            ))
          )}
        </div>
        <PlayerPiles 
          player={gameState.players[0]} 
          side="right" 
          showHand={true}
        />
      </div>
    </div>
  );
}

export default App;
