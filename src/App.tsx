import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { GameBoard } from './components/GameBoard';
import { PlayerBoard } from './components/PlayerBoard';
import { RootState } from './store/store';
import * as dragDropTouch from "drag-drop-touch";
import { useEffect } from 'react';
import { autoPlay, reset } from './store/game-slice';

console.log("Loaded drag and drop for touch devices", dragDropTouch);
let startAutoPlayTimestamp: number = Date.now();
  
function App() {
  const players = useSelector((state: RootState) => state.game.players);
  const gameOver = players.some(player => player.lost);
  const isAutoPlaying = useSelector((state: RootState) => state.game.isAutoPlaying);
  const dispatch = useDispatch();
    
  useEffect(() => {
    if (isAutoPlaying) {
      setTimeout(() => {
        startAutoPlayTimestamp = Date.now();
        // Play 100 games
        for (let i = 0; i < 100; i++) {
          dispatch(reset());
          dispatch(autoPlay());
        }
      }, 0);
    }
  }, [dispatch, isAutoPlaying]);

  useEffect(() => {
    if (gameOver) {
      const duration = Date.now() - startAutoPlayTimestamp;
      console.log(`Game over after ${duration}ms`);
    }
  }, [gameOver]);

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
  if (isAutoPlaying) {
    return (
      <div className="app-container">
        <div className="game-over">
          <h1>Auto-playing...</h1>
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
