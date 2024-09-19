import React from 'react';
import { GameObjectInstance } from '../models/GameObject';
import { Tile } from './Tile';
import './TileStack.css';
import { EmptyZone } from './EmptyZone';

interface TileStackProps {
  tiles: GameObjectInstance[];
  onClick?: () => void;
  showCover?: boolean;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const TileStack: React.FC<TileStackProps> = ({ tiles, onClick, showCover, onDrop, onDragOver }) => (
  <div className={"tile-stack" + (onClick ? " clickable" : "")} onClick={onClick} onDragOver={onDragOver} onDrop={onDrop}>
    {tiles.length === 0 && <EmptyZone />}
    {tiles.slice(Math.max(tiles.length - 10, 0)).map((tile, index) => (
      <Tile key={index} tile={tile} showCover={showCover} />
    ))}
  </div>
);