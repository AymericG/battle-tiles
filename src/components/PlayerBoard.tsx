import React from 'react';
import { Tile } from './Tile';
import { GameObject } from '../models/GameObject';
import './PlayerBoard.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TileStack } from './TileStack';
import { drawTile, moveToDiscard, moveToDraw, moveToHand } from '../store/gameSlice';

interface PlayerComponentProps {
  playerIndex: number;
}

const TileSpread = ({ name, tiles, onDrop }: { name: string; tiles: GameObject[]; onDrop: (e: React.DragEvent<HTMLDivElement>) => void }) => {
    return <div className="pile" onDrop={onDrop} onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }}>
    <h3>{name}</h3>
    <div className="tile-container">
      {tiles.map((tile, index) => (
        <Tile key={index} tile={tile} />
      ))}
    </div>
  </div>;
}

export const PlayerBoard: React.FC<PlayerComponentProps> = ({ playerIndex }) => {
  const player = useSelector((state: RootState) => state.game.players[playerIndex]);
  const dispatch = useDispatch();

  const handleDropOnHand = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('drop on hand');
    const data = e.dataTransfer.getData('text/plain');
    const tile: GameObject = JSON.parse(data);
    dispatch(moveToHand({ playerId: player.id, tile }));
  };

  const handleDropOnDiscard = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const tile: GameObject = JSON.parse(data);
    dispatch(moveToDiscard({ playerId: player.id, tile }));
  };

  const handleDropOnDraw = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const tile: GameObject = JSON.parse(data);
    dispatch(moveToDraw({ playerId: player.id, tile }));
  };

  const preventDefault = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }

  const handleDrawThree = () => {
    for (let i = 0; i < 3; i++) {
      dispatch(drawTile({ playerIndex }));
    }
  };

  return (
    <div className="player-piles">
      <h2>{player.name}</h2>
      <TileSpread name='Hand' tiles={player.hand} onDrop={handleDropOnHand} />
      <div className="pile">
        <h3>Draw</h3>
        <div className="draw-actions">
          <TileStack 
            showCover={true} 
            tiles={player.drawPile} 
            onClick={() => dispatch(drawTile({ playerIndex }))} 
            onDrop={handleDropOnDraw} 
            onDragOver={preventDefault} 
          />
          <button onClick={handleDrawThree}>Draw 3</button>
        </div>
      </div>
      <div className="pile">
        <h3>Discard</h3>
        <TileStack 
          tiles={player.discardPile} 
          onDrop={handleDropOnDiscard} 
          onDragOver={preventDefault}
        />
      </div>
    </div>
  );
};