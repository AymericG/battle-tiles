import { GameState } from "../models/GameState";
import { Tile } from "../models/Tile";
import { CellComponent } from "./CellComponent";

export const Board = ({ gameState, setGameState }: { gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) => {
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
        e.preventDefault();
        const tileData = e.dataTransfer.getData('text/plain');
        const tile: Tile = JSON.parse(tileData);
        setGameState((prevState: GameState) => {
            const newState = { ...prevState };
            
            // Remove the tile from the current player's hand
            const currentPlayer = newState.players[newState.currentPlayerIndex];
            currentPlayer.hand = currentPlayer.hand.filter(t => t !== tile);
            // Place the tile on the board
            const cell = newState.board[row][col];
            if (cell && cell?.tiles) {
                cell.tiles.push(tile);
            } else {
                console.error(`Invalid cell at row ${row}, col ${col}`);
            }
            
            // Switch to the next player
            newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
            return newState;
          });
    };
    return <div className="grid">
        {gameState.board.map((row, y) =>
            row.map((cell, x) => (
                <CellComponent key={`${x}-${y}`} cell={cell} onTileDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, x, y)} />
            ))
        )}
    </div>;

}