import { Cell } from "../models/Cell";
import { GameState } from "../models/GameState";
import { IPosition } from "../models/IPosition";
import { log } from "../utils/log";
import { AttackDirection } from "./types";

export function findAllEmptyCells(state: GameState) {
    log('Finding empty cells...');
    const emptyCells = state.board
        .map(row => row.map(cell => cell.tiles.length ? null : cell).filter(x => x))
        .map(x => x as Cell[])
        .flat();
    return emptyCells;
}

export function findAllAdjacentCells(position: IPosition, state: GameState) {
    return [...findCellsInDirection(position.x, position.y, AttackDirection.UP, 1, state),
        ...findCellsInDirection(position.x, position.y, AttackDirection.RIGHT, 1, state),
        ...findCellsInDirection(position.x, position.y, AttackDirection.DOWN, 1, state),
        ...findCellsInDirection(position.x, position.y, AttackDirection.LEFT, 1, state)];
}

export function findAllFriendlyTiles(state: GameState, playerId: number) {
    return state.board.flat().map(cell => cell.tiles && cell.tiles.find(t => t.playerId === playerId)).filter(x => x);
}

export function findAllEnemyTiles(state: GameState, playerId: number) {
    return state.board.flat().map(cell => cell.tiles && cell.tiles.find(t => t.playerId !== playerId)).filter(x => x);
}

export function findAllTiles(state: GameState) {
    return state.board.flat().map(cell => cell.tiles).flat();
}

export function findEnemiesInDirection({
    x, y, direction, range, playerId, state
}: { x: number; y: number; direction: AttackDirection; range: number; playerId: number; state: GameState }) {
    // using findCellsInDirection to find the cells
    const cells = findCellsInDirection(x, y, direction, range, state);
    // then filtering the tiles to only return the enemy tiles
    return cells.map(cell => cell.tiles.filter(t => t.playerId !== playerId)).flat();
}

export function findCellsInDirection(x: number, y: number, direction: AttackDirection, range: number, state: GameState) {
    const cells = [];
    switch (direction) {
        case AttackDirection.UP:
            for (let j = 1; j <= range; j++) {
                if (y - j < 0) { break; }
                if (state.board[y - j + 1][x].walls.includes('horizontal')) { break; }
                cells.push(state.board[y - j][x]);
            }
            break;
        case AttackDirection.RIGHT:
            for (let j = 1; j <= range; j++) {
                if (x + j >= state.board[y].length) { break; }
                if (state.board[y][x + j].walls.includes('vertical')) { break; }
                cells.push(state.board[y][x + j]);
            }
            break;
        case AttackDirection.DOWN:
            for (let j = 1; j <= range; j++) {
                if (y + j >= state.board.length) { break; }
                if (state.board[y + j][x].walls.includes('horizontal')) { break; }
                cells.push(state.board[y + j][x]);
            }
            break;
        case AttackDirection.LEFT:
            for (let j = 1; j <= range; j++) {
                if (x - j < 0) { break; }
                if (state.board[y][x - j + 1].walls.includes('vertical')) { break; }
                cells.push(state.board[y][x - j]);
            }
            break;
    }
    return cells;
}

export function isAdjacent(position: IPosition, otherPosition: IPosition) {
    // Check if two positions are orthogonally adjacent
    return Math.abs(position.x - otherPosition.x) + Math.abs(position.y - otherPosition.y) === 1;
}