import React from 'react';
import { Cell } from '../models/Cell';
import { UnitTile } from '../models/UnitTile';
import { ModuleTile } from '../models/ModuleTile';
import { ActionTile } from '../models/ActionTile';

export const CellComponent: React.FC<{ cell: Cell }> = ({ cell }) => (
  <div className="cell">
    {cell.tiles && cell.tiles.length > 0 && (
      <div className="tile-stack">
        {cell.tiles.map((tile, index) => (
          <div key={tile.id} className="tile">
            {tile.type === 'unit' && (
              <div className="unit-tile">
                <div className="unit-info">
                  H{(tile as UnitTile).health} 
                  I{(tile as UnitTile).initiative}
                </div>
                <div className="unit-attacks">
                  {['↑', '→', '↓', '←'].map((direction, edge) => {
                    const attack = (tile as UnitTile).getAttackForEdge(edge);
                    return (
                      <div key={edge} className={`edge-attack ${direction}`}>
                        {attack.value > 0 && `${direction}${attack.value}${attack.type[0]}`}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {tile.type === 'module' && (
              <div className="module-tile">Module: {(tile as ModuleTile).effect}</div>
            )}
            {tile.type === 'action' && (
              <div className="action-tile">Action: {(tile as ActionTile).actionType}</div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);