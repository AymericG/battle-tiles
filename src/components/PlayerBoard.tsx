import React from 'react';
import { TileComponent } from './Tile';
import { GameObject } from '../models/GameObject';
import './PlayerBoard.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TileStack } from './TileStack';
import { drawTile } from '../store/gameSlice';

interface PlayerComponentProps {
  playerIndex: number;
}

const TileSpread = ({ playerId, name, tiles, isDraggable = false }: { playerId: number; name: string; tiles: GameObject[]; isDraggable?: boolean }) => {
    return <div className="pile">
    <h3>{name}</h3>
    <div className="tile-container">
      {tiles.map((tile, index) => (
        <TileComponent key={index} tile={tile} isDraggable={isDraggable} onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
          e.dataTransfer.setData('text/plain', JSON.stringify({
            playerId, tile }));
        }}/>
      ))}
    </div>
  </div>;
}

export const PlayerBoard: React.FC<PlayerComponentProps> = ({ playerIndex }) => {
  const player = useSelector((state: RootState) => state.game.players[playerIndex]);
  const dispatch = useDispatch();
  return (
    <div className="player-piles">
      <h2>{player.name}</h2>
      <TileSpread name='Hand' playerId={player.id} tiles={player.hand} isDraggable={true} />
      <div className="pile">
        <h3>Draw</h3>
        <TileStack tiles={player.drawPile} onClick={() => {
          dispatch(drawTile({ playerIndex }));
        }
        } />
      </div>
      <div className="pile">
        <h3>Discard</h3>
        <TileStack tiles={player.discardPile} />
      </div>
      
    </div>
  );
};