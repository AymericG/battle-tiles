import React from 'react';
import { GameObject } from '../models/GameObject';
import { Tile } from './Tile';
import './TileStack.css';

interface TileStackProps {
  tiles: GameObject[];
  onClick?: () => void;
  showCover?: boolean;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const TileStack: React.FC<TileStackProps> = ({ tiles, onClick, showCover, onDrop, onDragOver }) => (
  <div className={"tile-stack" + (onClick ? " clickable" : "")} onClick={onClick} onDragOver={onDragOver} onDrop={onDrop}>
    {tiles.map((tile, index) => (
      <Tile key={index} tile={tile} showCover={showCover} />
    ))}
  </div>
);