import React from 'react';
import { Cell } from '../models/Cell';
import { TileComponent } from './TileComponent';

export const CellComponent: React.FC<{ cell: Cell, onTileDrop: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ cell, onTileDrop }) => (
  <div className="cell" onDrop={onTileDrop} onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }}>
    {cell.tiles && cell.tiles.length > 0 && (
      <div className="tile-stack">
        {cell.tiles.map((tile, index) => (
          <TileComponent key={index} tile={tile} />
        ))}
      </div>
    )}
  </div>
);