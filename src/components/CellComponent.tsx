import React from 'react';
import { Cell } from '../models/Cell';
import { TileComponent } from './TileComponent';

export const CellComponent: React.FC<{ cell: Cell }> = ({ cell }) => (
  <div className="cell">
    {cell.tiles && cell.tiles.length > 0 && (
      <div className="tile-stack">
        {cell.tiles.map((tile, index) => (
          <TileComponent key={tile.id} tile={tile} />
        ))}
      </div>
    )}
  </div>
);