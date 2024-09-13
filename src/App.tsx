import './App.css';
import { GameBoard } from './components/GameBoard';
import { PlayerBoard } from './components/PlayerBoard';

function App() {
  return (
    <div className="app-container">
      <div className="player-column">
        <PlayerBoard playerIndex={0} />
      </div>
      <div className="board-column">
        <GameBoard />
      </div>
      <div className="player-column">
        <PlayerBoard playerIndex={1} />
      </div>
    </div>);
}

export default App;
