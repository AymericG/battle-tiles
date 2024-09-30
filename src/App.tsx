import { useSelector } from 'react-redux';
import './App.css';
import { GameBoard } from './components/GameBoard';
import { PlayerBoard } from './components/PlayerBoard';
import { RootState } from './store/store';
import * as dragDropTouch from "drag-drop-touch";

console.log("Loaded drag and drop for touch devices", dragDropTouch);

function App() {
  const players = useSelector((state: RootState) => state.game.players);
  const gameOver = players.some(player => player.lost);
  
  if (gameOver) {
    const isTie = players.every(player => player.lost);
    return (
      <div className="app-container">
        <div className="game-over">
          <h1>Game Over!</h1>
          {isTie && <h2>It's a tie!</h2>}
          {!isTie && <h2>Winner: {players.filter(player => !player.lost).map(x => x.name).join(', ')}</h2>}
        </div>
      </div>
    );
  }
  return (
    <div className="app-container">
      <div className="player-column">
        <PlayerBoard player={players[0]} />
      </div>
      <div className="board-column">
        <GameBoard />
      </div>
      <div className="player-column">
        <PlayerBoard player={players[1]} />
      </div>
    </div>);
}

export default App;
