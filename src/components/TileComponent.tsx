import React from 'react';
import { Tile } from '../models/Tile';
import { UnitTile } from '../models/UnitTile';
import { ModuleTile } from '../models/ModuleTile';
import { ActionTile } from '../models/ActionTile';

interface TileComponentProps {
    tile: Tile;
    isDraggable?: boolean;
  }

interface DraggableTile {
    isDraggable?: boolean;
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const TileComponent: React.FC<TileComponentProps> = ({ tile, isDraggable }) => {
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(tile));
      };
    
      switch (tile.type) {
    case 'unit':
      return <UnitTileComponent tile={tile as UnitTile} isDraggable={isDraggable} onDragStart={handleDragStart}/>;
    case 'module':
      return <ModuleTileComponent tile={tile as ModuleTile} isDraggable={isDraggable} onDragStart={handleDragStart}/>;
    case 'action':
      return <ActionTileComponent tile={tile as ActionTile} isDraggable={isDraggable} onDragStart={handleDragStart}/>;
    default:
      return <div>Unknown tile type</div>;
  }
};

const UnitTileComponent: React.FC<{ tile: UnitTile } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile unit-tile" draggable={isDraggable}
  onDragStart={onDragStart}>
    <div className="unit-info">
      H{tile.health} I{tile.initiative}
    </div>
    <div className="unit-attacks">
      {['↑', '→', '↓', '←'].map((direction, edge) => {
        const attack = tile.getAttackForEdge(edge);
        return (
          <div key={edge} className={`edge-attack ${direction}`}>
            {attack.value > 0 && `${direction}${attack.value}${attack.type[0]}`}
          </div>
        );
      })}
    </div>
  </div>
);

const ModuleTileComponent: React.FC<{ tile: ModuleTile } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile module-tile" draggable={isDraggable}
  onDragStart={onDragStart}>
    <div className="module-content">Module: {tile.effect}</div>
  </div>
);

const ActionTileComponent: React.FC<{ tile: ActionTile } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile action-tile" draggable={isDraggable}
  onDragStart={onDragStart}>
    <div className="action-content">Action: {tile.actionType}</div>
  </div>
);
