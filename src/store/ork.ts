import { createAction, createModule, createUnit, shuffle } from "./army-utils";
import { Faction } from "../models/Faction";
import { LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../constants";

function createOrkBoy(playerId: number) {
    return createUnit('Ork Boy', playerId, Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 1, MELEE_SPEED);
}

function createLoota(playerId: number) {
    return createUnit("Loota", playerId, Faction.Orks, [
        { value: 1, type: 'range' },
        { value: 0, type: 'range' },
        { value: 0, type: 'range' },
        { value: 0, type: 'range' },
    ], 1, RANGE_SPEED, ['loot']);
}

function createGrot(playerId: number) {
    return createUnit("Grot", playerId, Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'melee' },
    ], 1, MELEE_SPEED, ['horde']);
}

export const createOrkArmy = (playerId: number) => ({
    base: createUnit(LEADER_UNIT, playerId, Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 5, 1),
    deck: shuffle([
        createOrkBoy(playerId),
        createOrkBoy(playerId),
        createOrkBoy(playerId),
        createOrkBoy(playerId),
        createOrkBoy(playerId),
        createLoota(playerId),
        createLoota(playerId),
        createLoota(playerId),
        createLoota(playerId),
        createGrot(playerId),
        createGrot(playerId),
        createGrot(playerId),
        createUnit("Nob", playerId, Faction.Orks, [
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
        ], 2, 3, ['inspiring-melee']),
        createUnit("Warbike", playerId, Faction.Orks, [
            { value: 1, type: 'melee' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'melee' },
        ], 2, 3),
        createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        createAction('WAAAGH!', playerId, Faction.Orks, 'special', 'All your units gain +1 melee attack for this turn.'),
        createAction('Mob Rule', playerId, Faction.Orks, 'special', 'Select one unit. It can attack twice this turn if it is adjacent to at least two other friendly units.'),
        createModule('Charge!', playerId, Faction.Orks, 'Move up to three of your units to adjacent empty tiles and immediately trigger a battle.'),
        createModule('Scrap Heap', playerId, Faction.Orks, 'Destroy one of your units to draw two additional tiles this turn.'),
        createModule('Mekboy Workshop', playerId, Faction.Orks, 'Adjacent friendly units heal 1 health at the end of each turn.'),
        createModule('Mad Dok\'s Surgery', playerId, Faction.Orks, 'When an adjacent friendly unit is destroyed, place it back in your hand instead of discarding it.'),
    ])
});