import React from 'react';
import { Tile } from '../models/Tile';
import { UnitTile } from '../models/UnitTile';
import { ModuleTile } from '../models/ModuleTile';
import { ActionTile } from '../models/ActionTile';

export const TileComponent: React.FC<{ tile: Tile }> = ({ tile }) => {
  switch (tile.type) {
    case 'unit':
      return <UnitTileComponent tile={tile as UnitTile} />;
    case 'module':
      return <ModuleTileComponent tile={tile as ModuleTile} />;
    case 'action':
      return <ActionTileComponent tile={tile as ActionTile} />;
    default:
      return <div>Unknown tile type</div>;
  }
};

const UnitTileComponent: React.FC<{ tile: UnitTile }> = ({ tile }) => (
  <div className="tile unit-tile">
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

const ModuleTileComponent: React.FC<{ tile: ModuleTile }> = ({ tile }) => (
  <div className="tile module-tile">
    <div className="module-content">Module: {tile.effect}</div>
  </div>
);

const ActionTileComponent: React.FC<{ tile: ActionTile }> = ({ tile }) => (
  <div className="tile action-tile">
    <div className="action-content">Action: {tile.actionType}</div>
  </div>
);