import React from 'react';
import { Tile } from './Tile';
import { GameObject, GameObjectInstance } from '../models/GameObject';
import './PlayerBoard.css';
import { useDispatch } from 'react-redux';
import { TileStack } from './TileStack';
import { aiTurn, drawTile, moveToDiscard, moveToDraw, moveToHand } from '../store/gameSlice';
import { Player } from '../models/Player';
import { TILES_TO_DRAW } from '../constants';
import { EmptyZone } from './EmptyZone';
import { getFactionColor } from '../utils/factions';

interface PlayerComponentProps {
  player: Player;
}

const TileSpread = ({ name, tiles, onDrop }: { name: string; tiles: GameObjectInstance[]; onDrop: (e: React.DragEvent<HTMLDivElement>) => void }) => {
    return <div className="pile" onDrop={onDrop} onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }}>
    <h3>{name}</h3>
    <div className="tile-container">
      {tiles.length === 0 && <EmptyZone />}
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
    const data = e.dataTransfer.getData('text/plain');
    const tile: GameObjectInstance = JSON.parse(data);
    dispatch(moveToHand({ playerId: player.id, tile }));
  };

  const handleDropOnDiscard = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const tile: GameObjectInstance = JSON.parse(data);
    dispatch(moveToDiscard({ playerId: player.id, tile }));
  };

  const handleDropOnDraw = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    const tile: GameObjectInstance = JSON.parse(data);
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
    <div className="player-piles" style={{
      '--faction-color': getFactionColor(player.faction)
  } as any}>
      <h2>{player.name}</h2>
      <div>
        <button onClick={drawCards}>Draw {TILES_TO_DRAW}</button>
        <button onClick={triggerAITurn}>AI turn</button>
      </div>
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
      <TileSpread name='Hand' tiles={player.hand} onDrop={handleDropOnHand} />
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