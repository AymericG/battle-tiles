import React from 'react';
import { GameObject } from '../models/GameObject';
import { Unit } from '../models/Unit';
import { Module } from '../models/Module';
import { Action } from '../models/Action';
import './Tile.css';

interface TileComponentProps {
  tile: GameObject;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

function getFactionColor(faction: string) {
  switch (faction) {
    case 'SpaceWolves':
      return 'lightblue';
    case 'Orks':
      return 'lightgreen';
    default:
      return 'gray';
  }
}

interface DraggableTile {
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const TileComponent: React.FC<TileComponentProps> = ({ tile, isDraggable, onDragStart }) => {
  
  switch (tile.type) {
    case 'unit':
      return <UnitTileComponent tile={tile as Unit} isDraggable={isDraggable} onDragStart={onDragStart} />;
    case 'module':
      return <ModuleTileComponent tile={tile as Module} isDraggable={isDraggable} onDragStart={onDragStart} />;
    case 'action':
      return <ActionTileComponent tile={tile as Action} isDraggable={isDraggable} onDragStart={onDragStart} />;
    default:
      return <div>Unknown tile type</div>;
  }
};

const EdgeAttackComponent = ({ attack, direction }: { attack: { value: number, type: string }, direction: string }) => {
  return (
    <div className={`edge-attack ${direction}`}>
      {attack.value > 0 && `${attack.value}${attack.type[0]}`}
    </div>
  );
}

const UnitTileComponent: React.FC<{ tile: Unit } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile unit-tile" draggable={isDraggable}
    style={{ backgroundColor: getFactionColor(tile.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
    onDragStart={onDragStart}>
    <div className='tile-top'>
      <div className='tile-top-left'>
        ϟ{tile.initiative}
      </div>
      <div className='tile-top-center'>
        <EdgeAttackComponent attack={tile.attacks[0]} direction='↑' />
      </div>
      <div className='tile-top-right'>
        ♥{tile.health}
      </div>
    </div>
    <div className='tile-middle'>
      <div className='tile-left'>
        <EdgeAttackComponent attack={tile.attacks[3]} direction='←' />
      </div>
      <div className='tile-center' />
      <div className='tile-right'>
        <EdgeAttackComponent attack={tile.attacks[1]} direction='→' />
        
      </div>
    </div>
    <div className='tile-bottom'>
      <EdgeAttackComponent attack={tile.attacks[2]} direction='↓' />
    </div>
  </div>
);

const ModuleTileComponent: React.FC<{ tile: Module } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div className="tile module-tile" draggable={isDraggable}
    style={{ backgroundColor: getFactionColor(tile.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
    onDragStart={onDragStart}>
    <div className="module-content"><div className="tile-label">Module</div>{tile.effect}</div>
  </div>
);

const ActionTileComponent: React.FC<{ tile: Action } & DraggableTile> = ({ tile, isDraggable, onDragStart }) => (
  <div style={{
    backgroundColor: getFactionColor(tile.faction)
  }} className="tile action-tile" draggable={isDraggable}
    onDragStart={onDragStart}>
    <div className="action-content"><div className="tile-label">Action</div>{tile.actionType}</div>
  </div>
);
