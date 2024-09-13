import './App.css';
import { Board } from './components/Board';
import { PlayerComponent } from './components/PlayerComponent';

function App() {
  return (
    <div className="app-container">
      <div className="player-column">
        <PlayerComponent playerIndex={0} />
      </div>
      <div className="board-column">
        <Board />
      </div>
      <div className="player-column">
        <PlayerComponent playerIndex={1} />
      </div>
    </div>);
}

export default App;
