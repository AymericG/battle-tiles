import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../models/GameState";

export function recordGame(state: Draft<GameState>) {
    // Store the game stats in the local storage (which faction won which faction)
    const gameHistory = JSON.parse(localStorage.getItem('gameHistory') || '[]');
    const players = state.players.map(p => ({ faction: p.faction, lost: p.lost }));
    gameHistory.push({
        players,
        timestamp: new Date().getTime()
    });
    localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}