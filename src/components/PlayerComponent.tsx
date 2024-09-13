import React from 'react';
import { TileComponent } from './TileComponent';
import { Tile } from '../models/Tile';
import './PlayerComponent.css'; // Update CSS import
import { Player } from '../models/Player';

interface PlayerComponentProps { // Rename interface
  player: Player;
}

const TileStack = ({ name, tiles }: { name: string; tiles: Tile[] }) => {
    return <div className="pile">
    <h3>{name}</h3>
    <div className="tile-container">
      {tiles.map((tile, index) => (
        <TileComponent key={index} tile={tile} />
      ))}
    </div>
  </div>;
}

export const PlayerComponent: React.FC<PlayerComponentProps> = ({ player }) => {
  return (
    <div className="player-piles">
      <h2>{player.name}</h2>
      <TileStack name='Hand' tiles={player.hand} />
      <TileStack name='Draw' tiles={player.drawPile} />
      <TileStack name='Discard' tiles={player.discardPile} />
      
    </div>
  );
};