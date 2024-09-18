import { Action } from "../models/Action";
import { Faction } from "../models/Faction";
import { Module } from "../models/Module";
import { AttackType, Unit } from "../models/Unit";
import { uuidv4 } from "../utils/uuid";

export function shuffle(array: any[]) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
} 

export function createUnit(name: string, playerId: number, faction: Faction, attacks: { value: number, type: AttackType }[], health: number, initiative: number, keywords?: string[]): Unit {
    return {
        name,
        id: uuidv4(),
        playerId,
        type: 'unit',
        faction,
        attacks,
        maxHealth: health,
        health,
        initiative,
        rotation: 0,
        keywords: keywords || []
    };
}

export function createModule(name: string, playerId: number, faction: Faction, effect: string): Module {
    return {
        id: uuidv4(),
        name,
        playerId,
        type: 'module',
        faction,
        effect,
        rotation: 0,
        health: 1,
        maxHealth: 1,
        connected: [true, true, true, true],
        keywords: []
    };
}

export function createAction(name: string, playerId: number, faction: Faction, actionType: 'move' | 'attack' | 'special', description: string): Action {
    return {
        id: uuidv4(),
        name,
        playerId,
        faction,
        type: 'action',
        actionType,
        description,
        keywords: []
    };
}