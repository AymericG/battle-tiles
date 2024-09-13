import React from 'react';
import { Tile } from './Tile';
import { GameObject } from '../models/GameObject';
import './PlayerBoard.css';
import { useDispatch } from 'react-redux';
import { TileStack } from './TileStack';
import { aiTurn, drawTile, moveToDiscard, moveToDraw, moveToHand } from '../store/gameSlice';
import { Player } from '../models/Player';
import { TILES_TO_DRAW } from '../constants';

interface PlayerComponentProps {
  player: Player;
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

export const PlayerBoard: React.FC<PlayerComponentProps> = ({ player }) => {
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

  const drawCards = () => {
    for (let i = 0; i < TILES_TO_DRAW; i++) {
      dispatch(drawTile({ playerId: player.id }));
    }
  };

  const triggerAITurn = () => {
    dispatch(aiTurn({ playerId: player.id }));
  };

  return (
    <div className="player-piles">
      <h2>{player.name}</h2>
      <button onClick={drawCards}>Draw {TILES_TO_DRAW}</button>
      <button onClick={triggerAITurn}>AI turn</button>
      <TileSpread name='Hand' tiles={player.hand} onDrop={handleDropOnHand} />
      <div className="pile">
        <h3>Draw</h3>
        <TileStack 
          showCover={true} 
          tiles={player.drawPile} 
          onClick={() => dispatch(drawTile({ playerId: player.id }))} 
          onDrop={handleDropOnDraw} 
          onDragOver={preventDefault} 
        />
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