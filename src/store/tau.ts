import { createAction, createModule, createUnit, shuffle } from "./army-utils";
import { Faction } from "../models/Faction";
import { LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../constants";

function createFireWarrior(playerId: number) {
    return createUnit('Fire Warrior', playerId, Faction.Tau, [
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 0, type: 'range' },
        { value: 1, type: 'range' },
    ], RANGE_SPEED, 1);
}

function createKrootCarnivore(playerId: number) {
    return createUnit("Kroot Carnivore", playerId, Faction.Tau, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 1, MELEE_SPEED, ['horde']);
}


export const createTauArmy = (playerId: number) => ({
    base: createUnit(LEADER_UNIT, playerId, Faction.Tau, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 5, 1),
    deck: shuffle([
        createFireWarrior(playerId),
        createFireWarrior(playerId),
        createFireWarrior(playerId),
        createFireWarrior(playerId),
        createFireWarrior(playerId),
        createUnit("Crisis Battlesuit", playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'range' },
        ], 2, RANGE_SPEED),
        createUnit("Stealth Suit", playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 0, type: 'melee' },
            { value: 0, type: 'range' },
            { value: 1, type: 'range' },
        ], 1, 3, ['stealthy']),
        createUnit("Broadside Battlesuit", playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 0, type: 'range' },
        ], 2, RANGE_SPEED),
        createKrootCarnivore(playerId),
        createKrootCarnivore(playerId),
        createKrootCarnivore(playerId),
        createKrootCarnivore(playerId),
        createKrootCarnivore(playerId),
        createAction('Battle', playerId, Faction.Tau, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Tau, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Tau, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Tau, 'attack', 'Battle'),
        createAction('Battle', playerId, Faction.Tau, 'attack', 'Battle'),
        createAction('Move', playerId, Faction.Tau, 'move', 'Move'),
        createAction('Move', playerId, Faction.Tau, 'move', 'Move'),
        createAction('Move', playerId, Faction.Tau, 'move', 'Move'),
        createAction('Move', playerId, Faction.Tau, 'move', 'Move'),
        createAction('Move', playerId, Faction.Tau, 'move', 'Move'),
        createAction('Kauyon Trap', playerId, Faction.Tau, 'special', 'Move one enemy unit to any unoccupied adjacent tile.'),
        createAction('Mont’ka Strike', playerId, Faction.Tau, 'special', 'All units in one chosen row or column gain +1 attack for this turn.'),
        createModule('Shield Drone', playerId, Faction.Tau, 'Adjacent friendly units gain +1 health.'),
        createModule('Shield Drone', playerId, Faction.Tau, 'Adjacent friendly units gain +1 health.'),
        createModule('Shield Drone', playerId, Faction.Tau, 'Adjacent friendly units gain +1 health.'),
        createModule('Markerlight', playerId, Faction.Tau, 'Adjacent friendly units gain +1 ranged attack.'),
        createModule('Markerlight', playerId, Faction.Tau, 'Adjacent friendly units gain +1 ranged attack.'),
        createModule('Markerlight', playerId, Faction.Tau, 'Adjacent friendly units gain +1 ranged attack.'),
    ])
});