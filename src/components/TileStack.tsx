import React from 'react';
import { GameObject } from '../models/GameObject';
import { TileComponent } from './Tile';
import './TileStack.css';

interface TileStackProps {
  tiles: GameObject[];
  onClick?: () => void;
  showCover?: boolean;
}

export const TileStack: React.FC<TileStackProps> = ({ tiles, onClick, showCover }) => (
  <div className={"tile-stack" + (onClick ? " clickable" : "")} onClick={onClick}>
    {tiles.map((tile, index) => (
      <TileComponent key={index} tile={tile} showCover={showCover} />
    ))}
  </div>
);