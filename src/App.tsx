import { useSelector } from 'react-redux';
import './App.css';
import { GameBoard } from './components/GameBoard';
import { PlayerBoard } from './components/PlayerBoard';
import { RootState } from './store/store';

function App() {
  const players = useSelector((state: RootState) => state.game.players);
  
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
