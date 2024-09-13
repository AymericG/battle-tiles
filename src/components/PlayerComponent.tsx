import React from 'react';
import { TileComponent } from './TileComponent';
import { Tile } from '../models/Tile';
import './PlayerComponent.css'; // Update CSS import
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface PlayerComponentProps {
  playerIndex: number;
}

const TileStack = ({ name, tiles, isDraggable = false }: { name: string; tiles: Tile[]; isDraggable?: boolean }) => {
    return <div className="pile">
    <h3>{name}</h3>
    <div className="tile-container">
      {tiles.map((tile, index) => (
        <TileComponent key={index} tile={tile} isDraggable={isDraggable} />
      ))}
    </div>
  </div>;
}

export const PlayerComponent: React.FC<PlayerComponentProps> = ({ playerIndex }) => {
  const player = useSelector((state: RootState) => state.game.players[playerIndex]);
  return (
    <div className="player-piles">
      <h2>{player.name}</h2>
      <TileStack name='Hand' tiles={player.hand} isDraggable={true} />
      <TileStack name='Draw' tiles={player.drawPile} />
      <TileStack name='Discard' tiles={player.discardPile} />
      
    </div>
  );
};