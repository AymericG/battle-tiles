import React from 'react';
import { Tile } from '../models/Tile';
import { TileComponent } from './TileComponent';
import './TileStack.css';

interface TileStackProps {
  tiles: Tile[];
}

export const TileStack: React.FC<TileStackProps> = ({ tiles }) => (
  <div className="tile-stack">
    {tiles.map((tile, index) => (
      <TileComponent key={index} tile={tile} />
    ))}
  </div>
);