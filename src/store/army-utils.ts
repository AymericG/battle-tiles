import { Action } from "../models/Action";
import { Faction } from "../models/Faction";
import { Module } from "../models/Module";
import { Rotatable } from "../models/Rotatable";
import { AttackType, Unit } from "../models/Unit";
import { uuidv4 } from "../utils/uuid";
import { allGameObjects } from "./all-game-objects";
import { GameObjectId } from "./types";

export function instanciateGameObject(objectId: GameObjectId, playerId: number) {
    return { id: uuidv4(), playerId, objectId };
}

export function instanciateGameObjects(objectId: GameObjectId, playerId: number, count: number) {
    return Array.from({ length: count }, () => instanciateGameObject(objectId, playerId));
}

export function instanciateRotatableObject(objectId: GameObjectId, playerId: number) {
    const template = allGameObjects[objectId] as Rotatable;
    return { id: uuidv4(), playerId, objectId, rotation: 0, health: template.health };
}

export function instanciateRotatableObjects(objectId: GameObjectId, playerId: number, count: number) {
    return Array.from({ length: count }, () => instanciateRotatableObject(objectId, playerId));
}

export function shuffle(array: any[]) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
} 

export function createUnit(id: GameObjectId, name: string, faction: Faction, attacks: { value: number, type: AttackType }[], health: number, initiative: number, keywords?: string[]): Unit {
    return {
        name,
        id,
        type: 'unit',
        faction,
        attacks,
        health,
        initiative,
        keywords: keywords || []
    };
}

export function createModule(id: GameObjectId, name: string, faction: Faction, effect: string): Module {
    return {
        id,
        name,
        type: 'module',
        faction,
        effect,
        health: 1,
        connected: [true, true, true, true],
        keywords: []
    };
}

export function createAction(id: GameObjectId, name: string, faction: Faction, actionType: 'move' | 'attack' | 'special', description: string): Action {
    return {
        id,
        name,
        faction,
        type: 'action',
        actionType,
        description,
        keywords: []
    };
}