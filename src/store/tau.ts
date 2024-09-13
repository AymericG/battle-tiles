import { createAction, createModule, createUnit, shuffle } from "./army-utils";
import { Faction } from "../models/Faction";

export const createTauArmy = (playerId: number) => ({
    base: createUnit('HQ', playerId, Faction.Tau, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 5, 1),
    deck: shuffle([
        createUnit('Fire Warrior', playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 0, type: 'range' },
            { value: 1, type: 'range' },
        ], 1, 1),
        createUnit('Fire Warrior', playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 0, type: 'range' },
            { value: 1, type: 'range' },
        ], 1, 1),
        createUnit('Fire Warrior', playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 0, type: 'range' },
            { value: 1, type: 'range' },
        ], 1, 1),
        createUnit('Fire Warrior', playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 0, type: 'range' },
            { value: 1, type: 'range' },
        ], 1, 1),
        createUnit('Fire Warrior', playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 1, type: 'range' },
            { value: 0, type: 'range' },
            { value: 1, type: 'range' },
        ], 1, 1),
        createUnit("Crisis Battlesuit", playerId, Faction.Tau, [
            { value: 2, type: 'range' },
            { value: 1, type: 'range' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
        ], 3, 2),
        createUnit("Stealth Suit", playerId, Faction.Tau, [
            { value: 1, type: 'range' },
            { value: 0, type: 'melee' },
            { value: 0, type: 'range' },
            { value: 1, type: 'range' },
        ], 2, 3, ['stealthy']),
        createUnit("Broadside Battlesuit", playerId, Faction.Tau, [
            { value: 3, type: 'range' },
            { value: 2, type: 'range' },
            { value: 3, type: 'range' },
            { value: 0, type: 'range' },
        ], 4, 2),
        createUnit("Kroot Carnivore", playerId, Faction.Tau, [
            { value: 1, type: 'melee' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'melee' },
        ], 3, 1, ['horde']),
        createUnit("Kroot Carnivore", playerId, Faction.Tau, [
            { value: 1, type: 'melee' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'melee' },
        ], 3, 1, ['horde']),
        createUnit("Kroot Carnivore", playerId, Faction.Tau, [
            { value: 1, type: 'melee' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'melee' },
        ], 3, 1, ['horde']),
        createUnit("Kroot Carnivore", playerId, Faction.Tau, [
            { value: 1, type: 'melee' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'melee' },
        ], 3, 1, ['horde']),
        createUnit("Kroot Carnivore", playerId, Faction.Tau, [
            { value: 1, type: 'melee' },
            { value: 1, type: 'melee' },
            { value: 0, type: 'melee' },
            { value: 1, type: 'melee' },
        ], 3, 1, ['horde']),
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