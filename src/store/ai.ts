import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../models/GameState";
import { Player } from "../models/Player";
import { LEADER_UNIT, TILES_TO_DRAW } from "../constants";
import { discardAsPlayer, drawTileAsPlayer, playTileAsPlayer } from "./game-state-utils";
import { GameObject } from "../models/GameObject";
import { EdgeAttack, Unit } from "../models/Unit";
import { Module } from "../models/Module";
import { Cell } from "../models/Cell";

function randomItem(items: any[]) {
    return items[Math.floor(Math.random() * items.length)];
}

function findAllEmptyCells(state: Draft<GameState>) {
    const emptyCells = [];
    for (let row = 0; row < state.board.length; row++) {
        for (let col = 0; col < state.board[row].length; col++) {
            const cell = state.board[row][col];
            if (!cell) { continue; }
            if (!cell.tiles || !cell.tiles.length) {
                emptyCells.push(cell);
                continue;
            }
        }
    }
    return emptyCells;
}

export function playAs(player: Player | undefined, state: Draft<GameState>) {
    if (!player) { return; }
    console.log(`Player ${player.id} is starting his/her turn.`);

    // First we draw X tiles
    console.log(`Player ${player.id} draws ${TILES_TO_DRAW} tiles.`);
    for (let i = 0; i < TILES_TO_DRAW; i++) {
        drawTileAsPlayer(player, state);
    }

    // For each tile in hand
    const tilesToPlay = [...player.hand];
    // Sort tiles by type, unit first, then module, then action
    tilesToPlay.sort((a, b) => {
        if (a.type === 'unit' && b.type !== 'unit') {
            return -1;
        }
        if (a.type !== 'unit' && b.type === 'unit') {
            return 1;
        }
        if (a.type === 'module' && b.type === 'action') {
            return -1;
        }
        if (a.type === 'action' && b.type === 'module') {
            return 1;
        }
        return 0;
    });
    
    while (player.hand.length > 1) {
        // Generate all possible moves
        const possibleActions = player.hand.flatMap(tile => generateAllPossibleActions(tile, state));
        evaluateAllActions(possibleActions, player, state);
        // Sort actions by score
        possibleActions.sort((a, b) => b.score - a.score);
        // Play the best action
        executeAction(possibleActions[0], state);
    }

    // Discard the last tile
    discardAsPlayer(player, player.hand[0], state);
}

enum ActionType {
    PLAY = 'play',
    DISCARD = 'discard'
}

enum AttackDirection {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
}

type PossibleAction = {
    type: ActionType,
    tile: GameObject,
    x?: number,
    y?: number,
    rotation?: number,
    score: number
}

function executeAction(action: PossibleAction, state: Draft<GameState>) {
    switch (action.type) {
        case ActionType.PLAY:
            if ('rotation' in action.tile) { 
                action.tile.rotation = action.rotation || action.tile.rotation;
            }
            playTileAsPlayer(action.tile, action.y || 0, action.x || 0, state);
            break;
        case ActionType.DISCARD:
            discardAsPlayer(state.players.find(x => x.id === action.tile.playerId), action.tile, state);
            break;
    }
}

function generateAllPossibleActions(tile: GameObject, state: Draft<GameState>): PossibleAction[] {
    if (tile.type === 'action') {
        return [{
            type: ActionType.DISCARD,
            tile,
            score: 0
        }]
    }
    // Find all available spots on the board
    const emptyCells = findAllEmptyCells(state);
    const possibleActions = [];
    for (const emptyCell of emptyCells) {
        for (let rotation = 0; rotation < 4; rotation++) {
            possibleActions.push({
                type: ActionType.PLAY,
                tile,
                x: emptyCell.x,
                y: emptyCell.y,
                rotation,
                score: 0
            });
        }
    }
    return possibleActions;
}

function evaluateAllActions(actions: any[], player: Player, state: Draft<GameState>) {
    for (const action of actions) {
        evaluateAction(action, player, state);
    }
}

function evaluateAction(action: any, player: Player, state: Draft<GameState>) {
    // Copy state
    const newState = JSON.parse(JSON.stringify(state));
    // Execute action
    executeAction(action, newState);
    // Evaluate state
    action.score = evaluateState(newState, player);
}

function evaluateState(state: GameState, player: Player) {
    let score = 0;
    for (let row = 0; row < state.board.length; row++) {
        for (let col = 0; col < state.board[row].length; col++) {
            const cell = state.board[row][col];
            if (!cell || !cell.tiles) { continue; }
            for (const tile of cell.tiles) {
                const tileScore = evaluateTile(tile, player, state);
                if (player.id === tile.playerId) {
                    score += tileScore;
                } else {
                    score -= tileScore;
                }
            }
        }
    }
    console.log(`Score: ${score}`);
    return score;
}

function evaluateTile(tile: GameObject, player: Player, state: GameState) {
    if (tile.type === 'unit') {
        return evaluateUnit(tile as Unit, player, state);
    }
    if (tile.type === 'module') {
        return evaluateModule(tile as Module, player, state);
    }
    return 0;
}

function evaluateAttack(targetCell: Cell, player: Player, initiative: number, attack: EdgeAttack) {
    const enemies = targetCell.tiles.filter(tile => tile.type === 'unit' && tile.playerId !== player.id).map(tile => tile as Unit);
    if (!enemies.length) {
        return 0;
    }
    if (enemies.some(x => x.health <= attack.value && x.initiative < initiative)) {
        return attack.value * 3;
    }
    if (enemies.some(x => x.name === LEADER_UNIT)) {
        return attack.value * 2;
    }
    return attack.value;
}


// TODO: This ignores the fact that this unit could be killed before it can act
function evaluateUnit(unit: Unit, player: Player, state: GameState) {
    const board = state.board;
    const tilePosition = findTilePosition(unit, state);
    if (!tilePosition) {
        return 0;
    }
    let damage = 0;
    unit.attacks.forEach((attack, edge) => {
        const direction = (edge + unit.rotation as number) % 4;
        const { row, col } = tilePosition;
        // TODO: this is ignoring range attacks
        // TODO: this is ignoring partial damage
        switch (direction) {
            case AttackDirection.UP:
                if (row > 0 && board[row - 1][col].tiles) {
                    damage = evaluateAttack(board[row - 1][col], player, unit.initiative, attack);
                }
                break;
            case AttackDirection.RIGHT:
                if (col < board[row].length - 1 && board[row][col + 1].tiles) {
                    damage = evaluateAttack(board[row][col + 1], player, unit.initiative, attack);
                }
                break;
            case AttackDirection.DOWN:
                if (row < board.length - 1 && board[row + 1][col].tiles) {
                    damage = evaluateAttack(board[row + 1][col], player, unit.initiative, attack);
                }
                break;
            case AttackDirection.LEFT:
                if (col > 0 && board[row][col - 1].tiles) {
                    damage = evaluateAttack(board[row][col - 1], player, unit.initiative, attack);
                }
                break;
        } 
    });
    return damage;
}

function findTilePosition(tile: GameObject, state: GameState) {
    for (let row = 0; row < state.board.length; row++) {
        for (let col = 0; col < state.board[row].length; col++) {
            const cell = state.board[row][col];
            if (!cell || !cell.tiles) { continue; }
            const originalTile = cell.tiles.find((t: GameObject) => t.id === tile.id);
            if (originalTile) {
                return { row, col };
            }
        }
    }
    return null;
}

function evaluateModule(module: Module, player: Player, state: GameState) {
    // Count the number of units adjacent to this module
    let adjacentUnits = 0;
    const board = state.board;
    const tilePosition = findTilePosition(module, state);
    if (!tilePosition) {
        return 0;
    }
    // TODO: This is ignoring the rotation and connections of the module
    const { row, col } = tilePosition;
    if (row > 0 && board[row - 1][col].tiles) {
        adjacentUnits += board[row - 1][col].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
    }
    if (row < board.length - 1 && board[row + 1][col].tiles) {
        adjacentUnits += board[row + 1][col].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
    }
    if (col > 0 && board[row][col - 1].tiles) {
        adjacentUnits += board[row][col - 1].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
    }
    if (col < board[row].length - 1 && board[row][col + 1].tiles) {
        adjacentUnits += board[row][col + 1].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
    }

    return adjacentUnits;
}

function playTileRandomlyAsPlayer(tile: GameObject, player: Player, state: Draft<GameState>) {
    // Find all available spots on the board
    const emptyCells = findAllEmptyCells(state);
    // Pick one randomly
    const emptyCell = randomItem(emptyCells);
    playTileAsPlayer(tile, emptyCell.y, emptyCell.x, state);
}

function playAllTilesRandomlyAsPlayer(player: Player, state: Draft<GameState>) {
    const randomTile = randomItem(player.hand);
    discardAsPlayer(player, randomTile, state);

    const tilesToPlay = [...player.hand];
    for (const tile of tilesToPlay) {
        if (tile.type === 'action') {
            discardAsPlayer(player, tile, state);
            continue;
        }

        // Find all available spots on the board
        const emptyCells = findAllEmptyCells(state);
        // Pick one randomly
        const emptyCell = randomItem(emptyCells);
        playTileAsPlayer(tile, emptyCell.y, emptyCell.x, state);
    }
}