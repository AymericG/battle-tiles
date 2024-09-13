import React from 'react';
import { Cell } from '../models/Cell';
import { TileStack } from './TileStack';
import './CellComponent.css';

export const CellComponent: React.FC<{ cell: Cell, onTileDrop: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ cell, onTileDrop }) => (
  <div className="cell" onDrop={onTileDrop} onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }}>
    {cell.tiles && cell.tiles.length > 0 && (
      <TileStack tiles={cell.tiles} />
    )}
  </div>
);