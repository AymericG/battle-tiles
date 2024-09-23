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
import { AttackType, Unit } from "../models/Unit";
import { Module } from "../models/Module";
import { Action } from "../models/Action";
import { log, setLoggingContext } from "../utils/log";
import { findAllEmptyCells, findAllFriendlyTiles, findAllTiles, findCellsInDirection, findEnemiesInDirection } from "./board-manipulation";

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

                if ((allGameObjects[action.tile.objectId] as Action).actionType === 'move' || (allGameObjects[action.tile.objectId] as Action).actionType === 'push') {
                    if (!action.params) {
                        throw new Error('Action must have params');
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

function generateAllRotatablePlays(tile: GameObjectInstance, emptyCells: Cell[]) {
    const possibleUnitPlacements: PossibleAction[] = emptyCells.flatMap(emptyCell => {
        return Array.from({ length: 4 }, (_, rotation) => ({
            type: ActionType.PLAY,
            tile,
            x: emptyCell.x,
            y: emptyCell.y,
            rotation,
            score: 0
        }));
    });

    if (possibleUnitPlacements.length === 0) {
        return [{
            type: ActionType.DISCARD,
            tile,
            score: 0
        }];
    }

    return possibleUnitPlacements;
}

function adjacentPosition(x: number, y: number, direction: AttackDirection) {
    return {
        x: x + (direction === AttackDirection.RIGHT ? 1 : direction === AttackDirection.LEFT ? -1 : 0),
        y: y + (direction === AttackDirection.DOWN ? 1 : direction === AttackDirection.UP ? -1 : 0)
    };
}

function isOutOfBounds(x: number, y: number) {
    return x < 0 || y < 0 || x >= BOARD_SIZE || y >= BOARD_SIZE;
}

function isEmptyCell(x: number, y: number, state: GameState) {
    return !state.board[y][x].tiles.length;
}

function isBlockedByWall(direction: AttackDirection, x: number, y: number, state: GameState) {
    const { x: targetX, y: targetY } = adjacentPosition(x, y, direction);

    // Check for walls
    if (direction === AttackDirection.UP && state.board[y][x].walls.includes('horizontal')) { return true; }
    if (direction === AttackDirection.RIGHT && state.board[targetY][targetX].walls.includes('vertical')) { return true; }
    if (direction === AttackDirection.DOWN && state.board[targetY][targetX].walls.includes('horizontal')) { return true; }
    if (direction === AttackDirection.LEFT && state.board[y][x].walls.includes('vertical')) { return true; }
    return false;
}

function generateAllMoves(tile: GameObjectInstance, state: GameState) {
    // For each friendly unit on the board
    // Find all adjacent empty cells
    // Generate a Play action for each rotation
    const allFriendlyTiles = findAllFriendlyTiles(state, tile.playerId);
    const possibleActions = [];
    for (const tileToMove of allFriendlyTiles) {
        if (!tileToMove) { continue; }
        const position = findTilePosition(tileToMove, state);
        if (!position) { continue; }
        const { x, y } = position;
        for (let direction = 0; direction < 4; direction++) {

            const { x: targetX, y: targetY } = adjacentPosition(x, y, direction);

            if (isOutOfBounds(targetX, targetY) || !isEmptyCell(targetX, targetY, state) || isBlockedByWall(direction, x, y, state)) {
                continue;
            }

            // Generate for each rotation
            for (let rotation = 0; rotation < 4; rotation++) {
                possibleActions.push({
                    type: ActionType.PLAY,
                    tile,
                    params: {
                        tile: tileToMove,
                        x: targetX,
                        y: targetY,
                        rotation,
                    },
                    score: 0
                });
            }
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

function generateAllPushes(pushTile: GameObjectInstance, state: GameState) {
    const possibleActions: PossibleAction[] = findAllFriendlyTiles(state, pushTile.playerId)
        .flatMap(friendlyTile => {
            const position = findTilePosition(friendlyTile, state);
            if (!position) { return null; }

            // Find all adjacent enemy units
            const { x, y } = position;
            return [
                { direction: AttackDirection.UP, enemyTiles: findEnemiesInDirection({ x, y, direction: AttackDirection.UP, range: 1, playerId: pushTile.playerId, state }) },
                { direction: AttackDirection.RIGHT, enemyTiles: findEnemiesInDirection({ x, y, direction: AttackDirection.RIGHT, range: 1, playerId: pushTile.playerId, state }) },
                { direction: AttackDirection.DOWN, enemyTiles: findEnemiesInDirection({ x, y, direction: AttackDirection.DOWN, range: 1, playerId: pushTile.playerId, state }) },
                { direction: AttackDirection.LEFT, enemyTiles: findEnemiesInDirection({ x, y, direction: AttackDirection.LEFT, range: 1, playerId: pushTile.playerId, state }) },
            ];
            
        }).filter(x => x)
        .flatMap(possiblePush => {
            if (!possiblePush) { return null; }
            // Find all empty cells in the direction of the push
            const { direction, enemyTiles } = possiblePush;
            const possiblePushActions = [];
            for (const enemyTile of enemyTiles) {
                const position = findTilePosition(enemyTile, state);
                if (!position) { continue; }
                const { x, y } = position;
                const { x: targetX, y: targetY } = adjacentPosition(x, y, direction);

                if (isOutOfBounds(targetX, targetY) || !isEmptyCell(targetX, targetY, state) || isBlockedByWall(direction, x, y, state)) {
                    continue;
                }

                possiblePushActions.push({
                    type: ActionType.PLAY,
                    tile: pushTile,
                    params: {
                        tile: enemyTile,
                        x: targetX,
                        y: targetY,
                        rotation: enemyTile.rotation,
                    },
                    score: 0
                });
            }
            return possiblePushActions;
        }).filter(x => !!x).map(x => x as PossibleAction);

    if (possibleActions.length === 0) {
        possibleActions.push({
            type: ActionType.DISCARD,
            tile: pushTile,
            score: 0
        });
    }
    return possibleActions;
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
            return generateAllMoves(tile, state);
        }
        if (template.actionType === 'push') {
            return generateAllPushes(tile, state);
        }

        // TODO: Implement all actions
        return [{
            type: ActionType.DISCARD,
            tile,
            score: 0
        }]
    }
    return generateAllRotatablePlays(tile, emptyCells);
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
    let score = findAllTiles(state)
        .map(tile => {
            const tileScore = evaluateTile(tile, state);
            const template = allGameObjects[tile.objectId];
            log(`${template.name} has a score of ${tileScore}`);
            return player.id === tile.playerId ? tileScore : -tileScore;
        })
        .reduce((totalScore, tileScore) => totalScore + tileScore, 0);
    score += addHandHeuristic(player.hand);
    return score;
}

function addHandHeuristic(hand: GameObjectInstance[]) {
    return hand.length;
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
            const { x: targetX, y: targetY } = adjacentPosition(x, y, direction);

            if (isOutOfBounds(targetX, targetY)) {
                continue;
            }

            if (isBlockedByWall(direction, x, y, state)) {
                continue;
            }

            score += board[targetY][targetX].tiles.some(t => t.playerId === tile.playerId) ? 2 : 1;
        }
        return score;
    }

    const unit = tile;
    const unitTemplate = template as Unit;
    for (let i = 0; i < 4; i++) {
        const attack = unitTemplate.attacks[i];
        if (!attack || attack.value === 0) { continue; }
        const direction = (i + unit.rotation as number) % 4;
        let range = attack.type === AttackType.Melee ? 1 : BOARD_SIZE;
        // log(`Checking influence for attack ${i} in direction ${direction}`);
        const cells = findCellsInDirection(x, y, direction, range, state);
        for (const cell of cells) {
            const cellScore = cell.tiles.some(t => t.playerId !== tile.playerId) ? 2 : 1;
            score += cellScore;
        }
    }
    log(`Influence ${score} for ${template.name}`);
    return score;
}

function evaluateTile(tile: RotatableInstance, state: GameState) {
    let score = 0;
    score += addHealthHeuristic(tile) * 3;
    score += addInfluenceHeuristic(tile, state);
    return score;
}
