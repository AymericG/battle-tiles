import React from 'react';
import { GameObject } from '../models/GameObject';
import { Unit } from '../models/Unit';
import { Module } from '../models/Module';
import { Action } from '../models/Action';
import './Tile.css';

interface TileComponentProps {
  tile: GameObject;
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
      return <UnitTileComponent tile={tile as Unit} isDraggable={isDraggable} onDragStart={handleDragStart} />;
    case 'module':
      return <ModuleTileComponent tile={tile as Module} isDraggable={isDraggable} onDragStart={handleDragStart} />;
    case 'action':
      return <ActionTileComponent tile={tile as Action} isDraggable={isDraggable} onDragStart={handleDragStart} />;
    default:
      return <div>Unknown tile type</div>;
  }
};

const UnitTileComponent: React.FC<{ tile: Unit } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile unit-tile" draggable={isDraggable}
    style={{ transform: `rotate(${tile.rotation * 90}deg)` }}
    onDragStart={onDragStart}>
    <div className="unit-info">
      H{tile.health} I{tile.initiative}
    </div>
    <div className="unit-attacks">
      {['↑', '→', '↓', '←'].map((direction, edge) => {
        const attack = tile.attacks[edge];
        return (
          <div key={edge} className={`edge-attack ${direction}`}>
            {attack.value > 0 && `${direction}${attack.value}${attack.type[0]}`}
          </div>
        );
      })}
    </div>
  </div>
);

const ModuleTileComponent: React.FC<{ tile: Module } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile module-tile" draggable={isDraggable}
    style={{ transform: `rotate(${tile.rotation * 90}deg)` }}
    onDragStart={onDragStart}>
    <div className="module-content">{tile.effect}</div>
  </div>
);

const ActionTileComponent: React.FC<{ tile: Action } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile action-tile" draggable={isDraggable}
    onDragStart={onDragStart}>
    <div className="action-content">{tile.actionType}</div>
  </div>
);
