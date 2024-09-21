import { createAction, createUnit } from "../army-utils";
import { Faction } from "../../models/Faction";
import { LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../../constants";
import { SpaceWolves } from "./game-object-ids";

export const gameObjects = {
    [SpaceWolves.Leader]: createUnit(SpaceWolves.Leader, LEADER_UNIT, Faction.SpaceWolves, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 5, 1),
    [SpaceWolves.FireWarrior]: createUnit(SpaceWolves.FireWarrior, 'Fire Warrior', Faction.SpaceWolves, [
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 0, type: 'range' },
        { value: 1, type: 'range' },
    ], RANGE_SPEED, 1),
    [SpaceWolves.KrootCarnivore]: createUnit(SpaceWolves.KrootCarnivore, "Kroot Carnivore", Faction.SpaceWolves, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 1, MELEE_SPEED, ['horde']),
    [SpaceWolves.CrisisBattlesuit]: createUnit(SpaceWolves.CrisisBattlesuit, "Crisis Battlesuit", Faction.SpaceWolves, [
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'range' },
    ], 2, RANGE_SPEED),
    [SpaceWolves.StealthSuit]: createUnit(SpaceWolves.StealthSuit, "Stealth Suit", Faction.SpaceWolves, [
        { value: 1, type: 'range' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'range' },
        { value: 1, type: 'range' },
    ], 1, 3, ['stealthy']),
    [SpaceWolves.BroadsideBattlesuit]: createUnit(SpaceWolves.BroadsideBattlesuit, "Broadside Battlesuit", Faction.SpaceWolves, [
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 1, type: 'range' },
        { value: 0, type: 'range' },
    ], 2, RANGE_SPEED),
    [SpaceWolves.Battle]: createAction(SpaceWolves.Battle, 'Battle', Faction.SpaceWolves, 'attack', 'Triggers a battle'),
    [SpaceWolves.Push]: createAction(SpaceWolves.Push, 'Push', Faction.SpaceWolves, 'push', 'Pushes an enemy unit one space away'),
    [SpaceWolves.Move]: createAction(SpaceWolves.Move, 'Move', Faction.SpaceWolves, 'move', 'Moves a friendly unit to an adjacent space'),
};
