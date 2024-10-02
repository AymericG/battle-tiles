import React from 'react';
import { useDispatch } from 'react-redux';
import { Cell } from '../models/Cell';
import { TileStack } from './TileStack';
import { rotateTile } from '../store/game-slice';
import './BoardCell.css';
import { WallDirection } from '../store/types';

export const BoardCell: React.FC<{ cell: Cell, onDrop: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ cell, onDrop }) => {
  const dispatch = useDispatch();

  const doRotateTile = () => {
    if (!cell.tiles) { return; }
    dispatch(rotateTile({ tileId: cell.tiles?.[cell.tiles.length - 1].id }));
  };

  return (
    <div className="cell" onDrop={onDrop} onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }}>
      {cell.walls.some(x => x === WallDirection.HORIZONTAL) && <div className="wall horizontal"></div>}
      {cell.walls.some(x => x === WallDirection.VERTICAL) && <div className="wall vertical"></div>}
      {cell.tiles && cell.tiles.length > 0 && (
        <TileStack tiles={cell.tiles} onClick={doRotateTile} />
      )}
    </div>
  );
};