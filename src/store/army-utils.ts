import { Action } from "../models/Action";
import { Faction } from "../models/Faction";
import { Module } from "../models/Module";
import { Rotatable } from "../models/Rotatable";
import { AttackType, Unit } from "../models/Unit";
import { uuidv4 } from "../utils/uuid";
import { allGameObjects } from "./all-game-objects";
import { Ability, GameObjectId } from "./types";

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

function parseAttacks(attacks: string) {
    // Turn 1r 1r 1r 1m into [{ value: 1, type: 'range' }, { value: 1, type: 'range' }, { value: 1, type: 'range' }, { value: 1, type: 'melee' }]
    return attacks.split(' ').map((attack, index) => {
        // use regex to split the number and the type
        const match = attack.match(/(\d+)([rm])/);
        if (!match) {
            throw new Error(`Invalid attack: ${attack}`);
        }
        const value = parseInt(match[1]);
        const type = match[2] === 'r' ? AttackType.Range : AttackType.Melee;
        return { value, type };
    });
}


export function createUnit(id: GameObjectId, name: string, faction: Faction, attacks: string, health: number, initiative: number, keywords?: string[]): Unit {
    return {
        name,
        id,
        type: 'unit',
        faction,
        attacks: parseAttacks(attacks),
        health,
        initiative,
        keywords: keywords || []
    };
}



export function createModule({
    id,
    name,
    faction,
    abilities
} : { id: GameObjectId; name: string; faction: Faction; abilities: Ability[] }): Module {
    return {
        id,
        name,
        type: 'module',
        faction,
        abilities,
        health: 1,
        connected: [true, true, true, true],
        keywords: []
    };
}

export function createAction(id: GameObjectId, name: string, faction: Faction, actionType: 'move' | 'attack' | 'special' | 'push', description: string): Action {
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