import React from 'react';
import { GameObject } from '../models/GameObject';
import { Unit } from '../models/Unit';
import { Module } from '../models/Module';
import { Action } from '../models/Action';
import './Tile.css';
import { Faction } from '../models/Faction';
import clsx from 'clsx';

interface TileComponentProps {
  tile: GameObject;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  showCover?: boolean;
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

function getFactionName(faction: string) {
  switch (faction) {
    case 'SpaceWolves':
      return 'Space Wolves';
    case 'Orks':
      return 'Orks';
    default:
      return 'Unknown';
  }
}

interface DraggableTile {
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  showCover?: boolean;
}

export const TileComponent: React.FC<TileComponentProps> = ({ tile, isDraggable, onDragStart, showCover }) => {
  switch (tile.type) {
    case 'unit':
      return <UnitTileComponent tile={tile as Unit} isDraggable={isDraggable} onDragStart={onDragStart} showCover={showCover} />;
    case 'module':
      return <ModuleTileComponent tile={tile as Module} isDraggable={isDraggable} onDragStart={onDragStart} showCover={showCover} />;
    case 'action':
      return <ActionTileComponent tile={tile as Action} isDraggable={isDraggable} onDragStart={onDragStart} showCover={showCover} />;
    default:
      return <div>Unknown tile type</div>;
  }
};

const EdgeAttackComponent = ({ attack, direction }: { attack: { value: number, type: string }, direction: string }) => {
  return (<>
    {attack.value > 0 && <div className={clsx('triangle', { 'triangle-narrow': attack.type === 'range' }, `triangle-${direction}`)}></div>}
    <div className={`edge-attack`}>
      {attack.value > 0 && <>{attack.value}</>}
    </div>
  </>);
}

const TileCover = ({ faction }: { faction: Faction }) => (
  <div className="tile-cover">
    <div className="tile-cover-content">{getFactionName(faction)}</div>
  </div>
);

const UnitTileComponent: React.FC<{ tile: Unit } & DraggableTile> = ({ tile, isDraggable, onDragStart, showCover }) => (
  <div className="tile unit-tile" draggable={isDraggable}
    style={{ backgroundColor: getFactionColor(tile.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
    onDragStart={onDragStart}>
    {showCover && <TileCover faction={tile.faction} />}
    {!showCover && <>
      <div className='tile-top'>
        <div className='tile-top-left'>
          <span className='unit-attribute-symbol'>ϟ</span>{tile.initiative}
        </div>
        <div className='tile-top-center'>
          <EdgeAttackComponent attack={tile.attacks[0]} direction='down' />
        </div>
        <div className='tile-top-right'>
          <span className='unit-attribute-symbol'>♥</span>{tile.health}
        </div>
      </div>
      <div className='tile-middle'>
        <div className='tile-left'>
          <EdgeAttackComponent attack={tile.attacks[3]} direction='right' />
        </div>
        <div className='tile-center' />
        <div className='tile-right'>
          <EdgeAttackComponent attack={tile.attacks[1]} direction='left' />

        </div>
      </div>
      <div className='tile-bottom'>
        <EdgeAttackComponent attack={tile.attacks[2]} direction='up' />
      </div>
    </>}
  </div>
);

const ModuleTileComponent: React.FC<{ tile: Module } & DraggableTile> = ({ tile, isDraggable, onDragStart, showCover }) => (
  <div className="tile module-tile" draggable={isDraggable}
    style={{ backgroundColor: getFactionColor(tile.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
    onDragStart={onDragStart}>
    {showCover && <TileCover faction={tile.faction} />}
    {!showCover && <div className="module-content">
      {tile.connected[0] && <div className="rectangle rectangle-top"></div>}
      {tile.connected[1] && <div className="rectangle rectangle-right"></div>}
      {tile.connected[2] && <div className="rectangle rectangle-bottom"></div>}
      {tile.connected[3] && <div className="rectangle rectangle-left"></div>}
      <div className="tile-label">Module</div>{tile.effect}
    </div>}
  </div>
);

const ActionTileComponent: React.FC<{ tile: Action } & DraggableTile> = ({ tile, isDraggable, onDragStart, showCover }) => (
  <div style={{
    backgroundColor: getFactionColor(tile.faction)
  }} className="tile action-tile" draggable={isDraggable}
    onDragStart={onDragStart}>
    {showCover && <TileCover faction={tile.faction} />}
    {!showCover && <div className="action-content"><div className="tile-label">Action</div>{tile.actionType}</div>}
  </div>
);
