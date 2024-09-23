import React, { useState } from 'react';
import { GameObjectInstance } from '../models/GameObject';
import { Module } from '../models/Module';
import { Action } from '../models/Action';
import './Tile.css';
import { Faction } from '../models/Faction';
import clsx from 'clsx';
import { getFactionColor, getFactionName } from '../utils/factions';
import { RotatableInstance } from '../models/Rotatable';
import { allGameObjects } from '../store/all-game-objects';
import { AttackType, Unit } from '../models/Unit';

interface TileComponentProps {
  tile: GameObjectInstance;
  isDraggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  showCover?: boolean;
}

interface DraggableTileProps {
  showCover?: boolean;
}

export const Tile: React.FC<TileComponentProps> = ({ tile, isDraggable, onDragStart, showCover }) => {
  const template = allGameObjects[tile.objectId];
  switch (template.type) {
    case 'unit':
      return <UnitTile tile={tile as RotatableInstance} showCover={showCover} />;
    case 'module':
      return <ModuleTile tile={tile as RotatableInstance} showCover={showCover} />;
    case 'action':
      return <ActionTile tile={tile as GameObjectInstance} showCover={showCover} />;
    default:
      return <div>Unknown tile type</div>;
  }
};

const DraggableTile = ({ tile, className, children, ...rest }: { tile: GameObjectInstance } & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
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
    {attack.value > 0 && <div className={clsx('triangle', { 'triangle-narrow': attack.type === AttackType.Range }, `triangle-${direction}`)}></div>}
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

const UnitTile: React.FC<{ tile: RotatableInstance } & DraggableTileProps> = ({ tile, showCover }) => {
  const template = allGameObjects[tile.objectId] as Unit;
  return <DraggableTile
    tile={tile} className="tile unit-tile with-tooltip"
    style={{ backgroundColor: getFactionColor(template.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
  >
    {showCover && <TileCover faction={template.faction} />}
    {!showCover && <>
      <div className="tooltip">
        {template.name}
        {!!template.keywords.length && <div>[{template.keywords.join(',')}]</div>}
      </div>
      <div className='tile-top'>
        <div className='tile-top-left'>
          <span className='unit-attribute-symbol'>ϟ</span>{template.initiative}
        </div>
        <div className='tile-top-center'>
          <EdgeAttackComponent attack={template.attacks[0]} direction='down' />
        </div>
        <div className='tile-top-right'>
          <span className='unit-attribute-symbol'>♥</span>{tile.health}
        </div>
      </div>
      <div className='tile-middle'>
        <div className='tile-left'>
          <EdgeAttackComponent attack={template.attacks[3]} direction='right' />
        </div>
        <div className='tile-center'>
          {!!template.keywords.length && <div className='tile-keyword'>{template.keywords.join(',')}</div>}
        </div>
        <div className='tile-right'>
          <EdgeAttackComponent attack={template.attacks[1]} direction='left' />

        </div>
      </div>
      <div className='tile-bottom'>
        <EdgeAttackComponent attack={template.attacks[2]} direction='up' />
      </div>
    </>}
  </DraggableTile>;
}

const ModuleTile: React.FC<{ tile: RotatableInstance } & DraggableTileProps> = ({ tile, showCover }) => {
  const template = allGameObjects[tile.objectId] as Module;
  return <DraggableTile
    tile={tile} className="tile module-tile"
    style={{ backgroundColor: getFactionColor(template.faction), transform: `rotate(${tile.rotation * 90}deg)` }}
  >
    {showCover && <TileCover faction={template.faction} />}
    {!showCover && <div className="module-content with-tooltip">
      <div className="tooltip">{template.effect}</div>
      {template.connected[0] && <div className="rectangle rectangle-top"></div>}
      {template.connected[1] && <div className="rectangle rectangle-right"></div>}
      {template.connected[2] && <div className="rectangle rectangle-bottom"></div>}
      {template.connected[3] && <div className="rectangle rectangle-left"></div>}
      <div className="tile-label">Module</div>{template.name}
    </div>}
  </DraggableTile>;
}

const ActionTile: React.FC<{ tile: GameObjectInstance } & DraggableTileProps> = ({ tile, showCover }) => {

  const template = allGameObjects[tile.objectId] as Action;
  return <DraggableTile
    tile={tile}
    style={{
      backgroundColor: getFactionColor(template.faction)
    }} className="tile action-tile"
  >
    {showCover && <TileCover faction={template.faction} />}
    {!showCover && <div className="action-content with-tooltip">
      <div className="tooltip">{template.description}</div>
      <div className="tile-label">Action</div>{template.name}</div>}
  </DraggableTile>;
}
