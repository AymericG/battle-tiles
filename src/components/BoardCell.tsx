import React from 'react';
import { useDispatch } from 'react-redux';
import { Cell } from '../models/Cell';
import { TileStack } from './TileStack';
import { rotateTile } from '../store/gameSlice';
import './BoardCell.css';

export const BoardCell: React.FC<{ cell: Cell, onTileDrop: (e: React.DragEvent<HTMLDivElement>) => void }> = ({ cell, onTileDrop }) => {
  const dispatch = useDispatch();

  const handleTileClick = () => {
    if (!cell.tiles) { return; }
    dispatch(rotateTile({ tileId: cell.tiles?.[cell.tiles.length - 1].id }));
  };

  return (
    <div className="cell" onDrop={onTileDrop} onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    }}>
      {cell.tiles && cell.tiles.length > 0 && (
        <TileStack tiles={cell.tiles} onClick={handleTileClick} />
      )}
    </div>
  );
};