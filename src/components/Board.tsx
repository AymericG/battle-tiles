import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateGameState } from '../store/gameSlice';
import { Tile } from "../models/Tile";
import { CellComponent } from "./CellComponent";
import { GameState } from '../models/GameState';

export function Board() {
    const gameState = useSelector((state: RootState) => state.game);
    const dispatch = useDispatch();

    const handleGameStateUpdate = (newState: GameState) => {
        dispatch(updateGameState(newState));
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
        e.preventDefault();
        const tileData = e.dataTransfer.getData('text/plain');
        const tile: Tile = JSON.parse(tileData);
        const newState = { ...gameState };
        
        // Remove the tile from the current player's hand
        const currentPlayer = newState.players[newState.currentPlayerIndex];
        currentPlayer.hand = currentPlayer.hand.filter(t => t !== tile);
        // Place the tile on the board
        const cell = newState.board[row][col];
        if (cell && cell?.tiles) {
            cell.tiles = [...cell.tiles, tile];
        } else {
            console.error(`Invalid cell at row ${row}, col ${col}`);
        }
        
        // Switch to the next player
        newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
        handleGameStateUpdate(newState);
    };


    return <div className="grid">
        {gameState.board.map((row, y) =>
            row.map((cell, x) => (
                <CellComponent key={`${x}-${y}`} cell={cell} onTileDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, y, x)} />
            ))
        )}
    </div>;

}