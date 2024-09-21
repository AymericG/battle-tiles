import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../models/GameState";
import { Player } from "../models/Player";
import { BOARD_SIZE, LEADER_UNIT, TILES_TO_DRAW } from "../constants";
import { battle, discardAsPlayer, drawTileAsPlayer, findTilePosition, playTileAsPlayer } from "./game-state-utils";
import { GameObjectInstance } from "../models/GameObject";
import { Cell } from "../models/Cell";
import { ActionType, AttackDirection, PossibleAction } from "./types";
import { allGameObjects } from "./all-game-objects";
import { RotatableInstance } from "../models/Rotatable";
import { Unit } from "../models/Unit";
import { Module } from "../models/Module";
import { Action } from "../models/Action";
import { log, setLoggingContext } from "../utils/log";

// function randomItem(items: any[]) {
//     return items[Math.floor(Math.random() * items.length)];
// }

function findAllEmptyCells(state: Draft<GameState>) {
    const emptyCells = [];
    log('Finding empty cells...');
    for (let row = 0; row < state.board.length; row++) {
        for (let col = 0; col < state.board[row].length; col++) {
            const cell = state.board[row][col];
            if (!cell || !cell.tiles) { continue; }
            if (!cell.tiles.length) {
                emptyCells.push(cell);
                continue;
            }
        }
    }
    return emptyCells;
}

export function playAs(player: Player | undefined, state: Draft<GameState>) {
    if (!player) { return; }
    log(`Player ${player.id} is starting his/her turn.`);

    // First we draw X tiles
    log(`Player ${player.id} draws ${TILES_TO_DRAW} tiles.`);
    for (let i = 0; i < TILES_TO_DRAW; i++) {
        drawTileAsPlayer(player, state);
    }

    // For each tile in hand
    const tilesToPlay = [...player.hand];
    // Sort tiles by type, unit first, then module, then action
    tilesToPlay.sort((a, b) => {
        const aTemplate = allGameObjects[a.objectId];
        const bTemplate = allGameObjects[b.objectId];
        if (aTemplate.type === 'unit' && bTemplate.type !== 'unit') {
            return -1;
        }
        if (aTemplate.type !== 'unit' && bTemplate.type === 'unit') {
            return 1;
        }
        if (aTemplate.type === 'module' && bTemplate.type === 'action') {
            return -1;
        }
        if (aTemplate.type === 'action' && bTemplate.type === 'module') {
            return 1;
        }
        return 0;
    });
    
    while (player.hand.length > 1) {
        // Generate all possible moves
        const emptyCells = findAllEmptyCells(state);
        const possibleActions = player.hand.flatMap(tile => generateAllPossibleActions(tile, emptyCells, state));
        log('Possible actions:', possibleActions);
        setLoggingContext('EVAL');
        evaluateAllActions(possibleActions, player, state);
        setLoggingContext('');
        // Sort actions by score
        possibleActions.sort((a, b) => b.score - a.score);
        // Play the best action
        const template = allGameObjects[possibleActions[0].tile.objectId];
        setLoggingContext('EXEC');
        log(`Player ${player.id} plays ${template.name} with score ${possibleActions[0].score}.`, possibleActions[0]);
        executeAction(possibleActions[0], state);
        
    }

    // Discard the last tile
    discardAsPlayer(player, player.hand[0], state);
    setLoggingContext('');
}


function executeAction(action: PossibleAction, state: Draft<GameState>) {
    switch (action.type) {
        case ActionType.PLAY:
            if (allGameObjects[action.tile.objectId].type === 'action') {

                if ((allGameObjects[action.tile.objectId] as Action).actionType === 'move') {
                    if (!action.params) {
                        throw new Error('Move action must have params');
                    }
                    // We simply discard the tile
                    // since the next step is to actually move a unit
                    log(`Player ${action.tile.playerId} plays action ${allGameObjects[action.tile.objectId].name}`);
                    discardAsPlayer(state.players.find(x => x.id === action.tile.playerId), action.tile, state);
                    action.params.tile.rotation = action.params.rotation;
                    playTileAsPlayer(action.params.tile as RotatableInstance, action.params.y || 0, action.params.x || 0, state);
                    return false;
                }
                if ((allGameObjects[action.tile.objectId] as Action).actionType === 'attack') {
                    // We simply discard the tile
                    // since the next step is to actually run a battle
                    log(`Player ${action.tile.playerId} plays action ${allGameObjects[action.tile.objectId].name}`);
                    discardAsPlayer(state.players.find(x => x.id === action.tile.playerId), action.tile, state);
                    battle(state);
                    // Indicate that we want to skip battle during evaluation
                    return true;
                }   
            }
            if ('rotation' in action.tile) { 
                action.tile.rotation = action.rotation || action.tile.rotation;
            }
            playTileAsPlayer(action.tile as RotatableInstance, action.y || 0, action.x || 0, state);
            break;
        case ActionType.DISCARD:
            discardAsPlayer(state.players.find(x => x.id === action.tile.playerId), action.tile, state);
            break;
    }
    return false;
}

function generateAllPossibleActions(tile: GameObjectInstance, emptyCells: Cell[], state: GameState): PossibleAction[] {
    const template = allGameObjects[tile.objectId];
    if (template.type === 'action') {
        if (template.actionType === 'attack') {
            return [{
                type: ActionType.PLAY,
                tile,
                score: 0
            }]
        }
        if (template.actionType === 'move') {
            // For each friendly unit on the board
            // Find all adjacent empty cells
            // Generate a Play action for each rotation
            const allFriendlyCells = state.board.flat().filter(cell => cell.tiles && cell.tiles.some(t => t.playerId === tile.playerId));
            const possibleActions = [];
            for (const cell of allFriendlyCells) {
                const tileToMove = cell.tiles.find(t => t.playerId === tile.playerId);
                if (!tileToMove) { continue; }
                const position = findTilePosition(tileToMove, state);
                if (!position) { continue; }
                const { x, y } = position;
                for (let direction = 0; direction < 4; direction++) {
                    const newX = x + (direction === AttackDirection.RIGHT ? 1 : direction === AttackDirection.LEFT ? -1 : 0);
                    const newY = y + (direction === AttackDirection.DOWN ? 1 : direction === AttackDirection.UP ? -1 : 0);
                    if (newX < 0 || newY < 0 || newX >= BOARD_SIZE || newY >= BOARD_SIZE) {
                        continue;
                    }

                    const targetCell = state.board[newY][newX];

                    // target cell must be empty
                    if (targetCell.tiles && targetCell.tiles.length) {
                        continue;
                    }
                    
                    // Check for walls
                    if (direction === AttackDirection.UP && state.board[y][x].walls.includes('horizontal')) { continue; }
                    if (direction === AttackDirection.RIGHT && targetCell.walls.includes('vertical')) { continue; }
                    if (direction === AttackDirection.DOWN && targetCell.walls.includes('horizontal')) { continue; }
                    if (direction === AttackDirection.LEFT && state.board[y][x].walls.includes('vertical')) { continue; }
                    
                    // Generate for each rotation
                    for (let rotation = 0; rotation < 4; rotation++) {
                        possibleActions.push({
                            type: ActionType.PLAY,
                            tile,
                            params: {
                                tile: tileToMove,
                                x: newX,
                                y: newY,
                                rotation,
                            },
                            score: 0
                        });
                    }
                }
            }
            return possibleActions;
        }
        return [{
            type: ActionType.DISCARD,
            tile,
            score: 0
        }]
    }
    // Find all available spots on the board
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
    if (possibleActions.length === 0) {
        possibleActions.push({
            type: ActionType.DISCARD,
            tile,
            score: 0
        });
    }
    return possibleActions;
}

function evaluateAllActions(actions: PossibleAction[], player: Player, state: Draft<GameState>) {
    for (const action of actions) {
        evaluateAction(action, player, state);
    }
}

function evaluateAction(action: PossibleAction, player: Player, state: Draft<GameState>) {
    // Copy state
    const cloneState = JSON.parse(JSON.stringify(state));
    const cloneAction = JSON.parse(JSON.stringify(action));
    // Execute action
    const skipBattle = executeAction(cloneAction, cloneState);
    if (!skipBattle) {
        battle(cloneState);
    }
    // Evaluate state
    action.score = evaluateState(cloneState, player);
}

function evaluateState(state: GameState, player: Player) {
    let score = 0;
    for (let row = 0; row < state.board.length; row++) {
        for (let col = 0; col < state.board[row].length; col++) {
            const cell = state.board[row][col];
            if (!cell || !cell.tiles) { continue; }
            for (const tile of cell.tiles) {
                const tileScore = evaluateTile(tile, player, state);
                const template = allGameObjects[tile.objectId];
                log(`${template.name} has a score of ${tileScore}`);
                if (player.id === tile.playerId) {
                    score += tileScore;
                } else {
                    score -= tileScore;
                }
            }
        }
    }
    log(`Score: ${score}`);
    return score;
}

function addHealthHeuristic(tile: RotatableInstance) {
    const template = allGameObjects[tile.objectId];
    let score = 0;
    switch (template.type) {
        case 'unit':
            const modifier = template.name === LEADER_UNIT ? 2 : 1;
            score += tile.health * modifier;
            break;
        case 'module':
            score += tile.health;
            break;
        default:
            score++;
    }
    return score;
}

export function addInfluenceHeuristic(tile: RotatableInstance, state: GameState) {
    let score = 0;
    const template = allGameObjects[tile.objectId];
    const position = findTilePosition(tile, state);
    if (!position) { return score; }
    const { x, y } = position;
    
    if (template.type === 'module') {
        const board = state.board;
        const moduleTemplate = template as Module;
        for (let i = 0; i < 4; i++) {
            if (!moduleTemplate.connected[i]) {
                continue;
            }
            const direction = (i + tile.rotation as number) % 4;
            switch (direction) {
                case AttackDirection.UP:
                    if (y === 0 || state.board[y][x].walls.includes('horizontal')) { continue; }
                    score += board[y - 1][x].tiles.some(t => t.playerId === tile.playerId) ? 2 : 1;
                    break;
                case AttackDirection.RIGHT:
                    if (x >= board[y].length - 1 || state.board[y][x + 1].walls.includes('vertical')) { continue; }
                    score += board[y][x + 1].tiles.some(t => t.playerId === tile.playerId) ? 2 : 1;
                    break;
                case AttackDirection.DOWN:
                    if (y >= board.length - 1 || state.board[y + 1][x].walls.includes('horizontal')) { continue; }
                    score += board[y + 1][x].tiles.some(t => t.playerId === tile.playerId) ? 2 : 1;
                    break;
                case AttackDirection.LEFT:
                    if (x === 0 || state.board[y][x - 1].walls.includes('vertical')) { continue; }
                    score += board[y][x - 1].tiles.some(t => t.playerId === tile.playerId) ? 2 : 1;
                    break;
            }
        }
        return score;
    }
    
    const unit = tile;
    const unitTemplate = template as Unit;
    for (let i = 0; i < 4; i++) {
        const attack = unitTemplate.attacks[i];
        if (!attack || attack.value === 0) { continue; }
        const direction = (i + unit.rotation as number) % 4;
        let range = attack.type === 'melee' ? 1 : BOARD_SIZE;
        // log(`Checking influence for attack ${i} in direction ${direction}`);
        switch (direction) {
            case AttackDirection.UP:
                for (let j = 1; j <= range; j++) {
                    if (y - j < 0) { break; }
                    if (state.board[y - j + 1][x].walls.includes('horizontal')) { break; }
                    const cellScore = state.board[y - j][x].tiles.some(t => t.playerId !== tile.playerId) ? 2 : 1;
                    score += cellScore;
                    // log(`Added ${cellScore} for cell ${col}, ${row - j}`);
                }
                break;
            case AttackDirection.RIGHT:
                for (let j = 1; j <= range; j++) {
                    if (x + j >= state.board[y].length) { break; }
                    if (state.board[y][x + j].walls.includes('vertical')) { break; }
                    const cellScore = state.board[y][x + j].tiles.some(t => t.playerId !== tile.playerId) ? 2 : 1;
                    score += cellScore;
                    // log(`Added ${cellScore} for cell ${col + j}, ${row}`);
                }
                break;
            case AttackDirection.DOWN:
                for (let j = 1; j <= range; j++) {
                    if (y + j >= state.board.length) { break; }
                    if (state.board[y + j][x].walls.includes('horizontal')) { break; }
                    const cellScore = state.board[y + j][x].tiles.some(t => t.playerId !== tile.playerId) ? 2 : 1;
                    score += cellScore;
                    // log(`Added ${cellScore} for cell ${col}, ${row + j}`);
                }
                break;
            case AttackDirection.LEFT:
                for (let j = 1; j <= range; j++) {
                    if (x - j < 0) { break; }
                    if (state.board[y][x - j + 1].walls.includes('vertical')) { break; }
                    const cellScore = state.board[y][x - j].tiles.some(t => t.playerId !== tile.playerId) ? 2 : 1;
                    score += cellScore;
                    // log(`Added ${cellScore} for cell ${col - j}, ${row}`);
                }
                break;
        }
    }
    log(`Influence ${score} for ${template.name}`);
    return score;
}

function evaluateTile(tile: RotatableInstance, player: Player, state: GameState) {
    const template = allGameObjects[tile.objectId];
    let score = 0;
    score += addHealthHeuristic(tile) * 3;
    score += addInfluenceHeuristic(tile, state);
    return score;
    
    // if (tile.type === 'unit') {
    //     return evaluateUnit(tile as Unit, player, state);
    // }
    // if (tile.type === 'module') {
    //     return evaluateModule(tile as Module, player, state);
    // }
    // return 0;
}

// function evaluateAttack(targetCell: Cell, player: Player, initiative: number, attack: EdgeAttack) {
//     const enemies = targetCell.tiles.filter(tile => allGameObjects[tile.objectId].type === 'unit' && tile.playerId !== player.id);
//     if (!enemies.length) {
//         return 0;
//     }
//     if (enemies.some(x => x.health <= attack.value && (allGameObjects[x.objectId] as Unit).initiative < initiative)) {
//         return attack.value * 3;
//     }
//     if (enemies.some(x => allGameObjects[x.objectId].name === LEADER_UNIT)) {
//         return attack.value * 2;
//     }
//     return attack.value;
// }


// TODO: This ignores the fact that this unit could be killed before it can act
// function evaluateUnit(unit: Unit, player: Player, state: GameState) {
//     const board = state.board;
//     const tilePosition = findTilePosition(unit, state);
//     if (!tilePosition) {
//         return 0;
//     }
//     let damage = 0;
//     unit.attacks.forEach((attack, edge) => {
//         const direction = (edge + unit.rotation as number) % 4;
//         const { row, col } = tilePosition;
//         // TODO: this is ignoring range attacks
//         // TODO: this is ignoring partial damage
//         switch (direction) {
//             case AttackDirection.UP:
//                 if (row > 0 && board[row - 1][col].tiles) {
//                     damage = evaluateAttack(board[row - 1][col], player, unit.initiative, attack);
//                 }
//                 break;
//             case AttackDirection.RIGHT:
//                 if (col < board[row].length - 1 && board[row][col + 1].tiles) {
//                     damage = evaluateAttack(board[row][col + 1], player, unit.initiative, attack);
//                 }
//                 break;
//             case AttackDirection.DOWN:
//                 if (row < board.length - 1 && board[row + 1][col].tiles) {
//                     damage = evaluateAttack(board[row + 1][col], player, unit.initiative, attack);
//                 }
//                 break;
//             case AttackDirection.LEFT:
//                 if (col > 0 && board[row][col - 1].tiles) {
//                     damage = evaluateAttack(board[row][col - 1], player, unit.initiative, attack);
//                 }
//                 break;
//         } 
//     });
//     return damage;
// }

// function findTilePosition(tile: GameObject, state: GameState) {
//     for (let row = 0; row < state.board.length; row++) {
//         for (let col = 0; col < state.board[row].length; col++) {
//             const cell = state.board[row][col];
//             if (!cell || !cell.tiles) { continue; }
//             const originalTile = cell.tiles.find((t: GameObject) => t.id === tile.id);
//             if (originalTile) {
//                 return { row, col };
//             }
//         }
//     }
//     return null;
// }

// function evaluateModule(module: Module, player: Player, state: GameState) {
//     // Count the number of units adjacent to this module
//     let adjacentUnits = 0;
//     const board = state.board;
//     const tilePosition = findTilePosition(module, state);
//     if (!tilePosition) {
//         return 0;
//     }
//     // TODO: This is ignoring the rotation and connections of the module
//     const { row, col } = tilePosition;
//     if (row > 0 && board[row - 1][col].tiles) {
//         adjacentUnits += board[row - 1][col].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
//     }
//     if (row < board.length - 1 && board[row + 1][col].tiles) {
//         adjacentUnits += board[row + 1][col].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
//     }
//     if (col > 0 && board[row][col - 1].tiles) {
//         adjacentUnits += board[row][col - 1].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
//     }
//     if (col < board[row].length - 1 && board[row][col + 1].tiles) {
//         adjacentUnits += board[row][col + 1].tiles.filter(tile => tile.type === 'unit' && tile.playerId === player.id).length;
//     }

//     return adjacentUnits;
// }

// function playTileRandomlyAsPlayer(tile: GameObject, player: Player, state: Draft<GameState>) {
//     // Find all available spots on the board
//     const emptyCells = findAllEmptyCells(state);
//     // Pick one randomly
//     const emptyCell = randomItem(emptyCells);
//     playTileAsPlayer(tile, emptyCell.y, emptyCell.x, state);
// }

// function playAllTilesRandomlyAsPlayer(player: Player, state: Draft<GameState>) {
//     const randomTile = randomItem(player.hand);
//     discardAsPlayer(player, randomTile, state);

//     const tilesToPlay = [...player.hand];
//     for (const tile of tilesToPlay) {
//         if (tile.type === 'action') {
//             discardAsPlayer(player, tile, state);
//             continue;
//         }

//         // Find all available spots on the board
//         const emptyCells = findAllEmptyCells(state);
//         // Pick one randomly
//         const emptyCell = randomItem(emptyCells);
//         playTileAsPlayer(tile, emptyCell.y, emptyCell.x, state);
//     }
// }