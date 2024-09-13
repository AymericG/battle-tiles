import React from 'react';
import { TileComponent } from './TileComponent';
import { Tile } from '../models/Tile';
import './PlayerComponent.css'; // Update CSS import
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { TileStack } from './TileStack';

interface PlayerComponentProps {
  playerIndex: number;
}

const TileSpread = ({ name, tiles, isDraggable = false }: { name: string; tiles: Tile[]; isDraggable?: boolean }) => {
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
      <TileSpread name='Hand' tiles={player.hand} isDraggable={true} />
      <div className="pile">
        <h3>Draw</h3>
        <TileStack tiles={player.drawPile} />
      </div>
      <div className="pile">
        <h3>Discard</h3>
        <TileStack tiles={player.discardPile} />
      </div>
      
    </div>
  );
};