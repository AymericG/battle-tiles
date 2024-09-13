import React, { useState } from 'react';
import { GameObject } from '../models/GameObject';
import { Unit } from '../models/Unit';
import { Module } from '../models/Module';
import { Action } from '../models/Action';
import './Tile.css';
import { Faction } from '../models/Faction';
import clsx from 'clsx';
import { getFactionColor, getFactionName } from '../utils/factions';

interface TileComponentProps {
  tile: GameObject;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  showCover?: boolean;
}

interface DraggableTileProps {
  showCover?: boolean;
}

export const Tile: React.FC<TileComponentProps> = ({ tile, isDraggable, onDragStart, showCover }) => {
  switch (tile.type) {
    case 'unit':
      return <UnitTile tile={tile as Unit} showCover={showCover} />;
    case 'module':
      return <ModuleTile tile={tile as Module} showCover={showCover} />;
    case 'action':
      return <ActionTile tile={tile as Action} showCover={showCover} />;
    default:
      return <div>Unknown tile type</div>;
  }
};

const DraggableTile = ({ tile, className, children, ...rest }: { tile: GameObject } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const [isBeingDragged, setIsBeingDragged] = useState(false);

  return <div {...rest} className={clsx(className, { dragged: isBeingDragged })} draggable onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
    setIsBeingDragged(true);
    e.dataTransfer.setData('text/plain', JSON.stringify(tile));
  }}
  onDragEnd={(e) => {
    setIsBeingDragged(false);
  }}>
    {children}
  </div>;
}

const EdgeAttackComponent = ({ attack, direction }: { attack: { value: number, type: string }, direction: string }) => {
  return (<>
    {attack.value > 0 && <div className={clsx('triangle', { 'triangle-narrow': attack.type === 'range' }, `triangle-${direction}`)}></div>}
    <div className={`edge-attack`}>
      {attack.value > 1 && <>{attack.value}</>}
    </div>
  </>);
}

const TileCover = ({ faction }: { faction: Faction }) => (
  <div className="tile-cover">
    <div className="tile-cover-content">{getFactionName(faction)}</div>
  </div>
);

const UnitTile: React.FC<{ tile: Unit } & DraggableTileProps> = ({ tile, showCover }) => (
  <DraggableTile
    tile={tile} className="tile unit-tile with-tooltip"
    style={{ backgroundColor: getFactionColor(tile.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
  >
    {showCover && <TileCover faction={tile.faction} />}
    {!showCover && <>
      <div className="tooltip">{tile.name}</div>
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
  </DraggableTile>
);

const ModuleTile: React.FC<{ tile: Module } & DraggableTileProps> = ({ tile, showCover }) => (
  <DraggableTile
    tile={tile} className="tile module-tile"
    style={{ backgroundColor: getFactionColor(tile.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
  >
    {showCover && <TileCover faction={tile.faction} />}
    {!showCover && <div className="module-content with-tooltip">
      <div className="tooltip">{tile.effect}</div>
      {tile.connected[0] && <div className="rectangle rectangle-top"></div>}
      {tile.connected[1] && <div className="rectangle rectangle-right"></div>}
      {tile.connected[2] && <div className="rectangle rectangle-bottom"></div>}
      {tile.connected[3] && <div className="rectangle rectangle-left"></div>}
      <div className="tile-label">Module</div>{tile.name}
    </div>}
  </DraggableTile>
);

const ActionTile: React.FC<{ tile: Action } & DraggableTileProps> = ({ tile, showCover }) => (
  <DraggableTile
    tile={tile}
    style={{
      backgroundColor: getFactionColor(tile.faction)
    }} className="tile action-tile"
  >
    {showCover && <TileCover faction={tile.faction} />}
    {!showCover && <div className="action-content with-tooltip">
      <div className="tooltip">{tile.description}</div>
      <div className="tile-label">Action</div>{tile.name}</div>}
  </DraggableTile>
);
