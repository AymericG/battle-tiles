import { createAction, createUnit } from "../army-utils";
import { Faction } from "../../models/Faction";
import { LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../../constants";
import { Tau } from "./game-object-ids";

export const gameObjects = {
    [Tau.Leader]: createUnit(Tau.Leader, LEADER_UNIT, Faction.Tau, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 5, 1),
    [Tau.FireWarrior]: createUnit(Tau.FireWarrior, 'Fire Warrior', Faction.Tau, [
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 0, type: 'range' },
        { value: 1, type: 'range' },
    ], RANGE_SPEED, 1),
    [Tau.KrootCarnivore]: createUnit(Tau.KrootCarnivore, "Kroot Carnivore", Faction.Tau, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 1, MELEE_SPEED, ['horde']),
    [Tau.CrisisBattlesuit]: createUnit(Tau.CrisisBattlesuit, "Crisis Battlesuit", Faction.Tau, [
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'range' },
    ], 2, RANGE_SPEED),
    [Tau.StealthSuit]: createUnit(Tau.StealthSuit, "Stealth Suit", Faction.Tau, [
        { value: 1, type: 'range' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'range' },
        { value: 1, type: 'range' },
    ], 1, 3, ['stealthy']),
    [Tau.BroadsideBattlesuit]: createUnit(Tau.BroadsideBattlesuit, "Broadside Battlesuit", Faction.Tau, [
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 0, type: 'range' },
    ], 2, RANGE_SPEED),
    [Tau.Battle]: createAction(Tau.Battle, 'Battle', Faction.Tau, 'attack', 'Triggers a battle'),
    [Tau.Push]: createAction(Tau.Push, 'Push', Faction.Tau, 'push', 'Pushes an enemy unit one space away'),
    [Tau.Move]: createAction(Tau.Move, 'Move', Faction.Tau, 'move', 'Moves a friendly unit to an adjacent space'),
};
