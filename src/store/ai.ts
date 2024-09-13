import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../models/GameState";
import { Player } from "../models/Player";
import { TILES_TO_DRAW } from "../constants";
import { discardAsPlayer, drawTileAsPlayer, playTileAsPlayer } from "./game-state-utils";

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

    // Then we randomly discard a tile
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