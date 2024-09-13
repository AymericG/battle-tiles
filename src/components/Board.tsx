import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { moveTile } from '../store/gameSlice';
import { Tile } from "../models/Tile";
import { CellComponent } from "./CellComponent";

export function Board() {
    const gameState = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
        e.preventDefault();
        const tileData = e.dataTransfer.getData('text/plain');
        const tile: Tile = JSON.parse(tileData);
        dispatch(moveTile({ tile, row, col }));
    };

    return <div className="grid">
        {gameState.board.map((row, y) =>
            row.map((cell, x) => (
                <CellComponent key={`${x}-${y}`} cell={cell} onTileDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, y, x)} />
            ))
        )}
    </div>;
}