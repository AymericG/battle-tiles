import React from 'react';
import { Tile } from '../models/Tile';
import { TileComponent } from './TileComponent';
import './TileStack.css';

interface TileStackProps {
  tiles: Tile[];
  onClick?: () => void;
}

export const TileStack: React.FC<TileStackProps> = ({ tiles, onClick }) => (
  <div className={"tile-stack" + (onClick ? " clickable" : "")} onClick={onClick}>
    {tiles.map((tile, index) => (
      <TileComponent key={index} tile={tile} />
    ))}
  </div>
);