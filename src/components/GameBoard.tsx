import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addDamage, moveTile, resolveBattle } from '../store/gameSlice';
import { BoardCell } from "./BoardCell";
import './GameBoard.css';

interface DraggedItem {
    type: string;
}

export function GameBoard() {
    const gameState = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('text/plain');
        const draggedItem: DraggedItem = JSON.parse(data);
        if (draggedItem.type === 'damage') {
            dispatch(addDamage({ row, col }));
        } else {
            dispatch(moveTile({ tile: draggedItem as any, row, col }));
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ type: 'damage' }));
    };

    return (
        <div className="game-board-container">
            <h2 className="board-title">Battle Tiles: <span className='dim'>Grimdark</span></h2>
            <div className="perspective">
                <div className="grid">
                    {gameState.board.map((row, y) =>
                        row.map((cell, x) => (
                            <BoardCell key={`${x}-${y}`} cell={cell} onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, y, x)} />
                        ))
                    )}
                </div>
            </div>

            <footer className='game-board-footer'>
                <button onClick={() => {
                    dispatch(resolveBattle());
                }}>Battle!</button>
                <div 
                    className="damage-disc" 
                    draggable 
                    onDragStart={handleDragStart}
                >✹</div>
            </footer>
        </div>
    );
}