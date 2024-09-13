import React, { useState } from 'react';
import './App.css';
import { Board } from './components/Board';
import { PlayerComponent } from './components/PlayerComponent';
import { initialGameState } from './initialGameState';

function App() {
  const [gameState, setGameState] = useState(initialGameState);
  return (
    <div className="app-container">
      <div className="player-column player1-column">
        <PlayerComponent player={gameState.players[0]} />
      </div>
      <div className="board-column">
        <Board gameState={gameState} setGameState={setGameState} />
      </div>
      <div className="player-column player2-column">
        <PlayerComponent player={gameState.players[1]} />
      </div>
    </div>
  );
}

export default App;
