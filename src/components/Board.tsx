import { GameState } from "../models/GameState";
import { CellComponent } from "./CellComponent";

export const Board = ({ gameState }: { gameState: GameState }) => {
    return <div className="grid">
        {gameState.map.map((row, y) =>
            row.map((cell, x) => (
                <CellComponent key={`${x}-${y}`} cell={cell} />
            ))
        )}
    </div>;

}