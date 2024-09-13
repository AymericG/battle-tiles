import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { moveTile } from '../store/gameSlice';
import { GameObject } from "../models/GameObject";
import { BoardCell } from "./BoardCell";
import './GameBoard.css';

export function GameBoard() {
    const gameState = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const tile: GameObject = JSON.parse(data);
        dispatch(moveTile({ tile, row, col }));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'damage' }));
    };

    return (
        <div className="game-board-container">
            <div className="grid">
                {gameState.board.map((row, y) =>
                    row.map((cell, x) => (
                        <BoardCell key={`${x}-${y}`} cell={cell} onTileDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, y, x)} />
                    ))
                )}
            </div>
            <div 
                className="damage-disc" 
                draggable 
                onDragStart={handleDragStart}
            ></div>
        </div>
    );
}