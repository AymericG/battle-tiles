import { createAction, createModule, createUnit } from "../army-utils";
import { Faction } from "../../models/Faction";
import { LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../../constants";
import { Ork } from "./game-object-ids";

export const gameObjects = {
    [Ork.Leader]: createUnit(Ork.Leader, LEADER_UNIT, Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 5, 1),
    [Ork.Boy]: createUnit(Ork.Boy, 'Ork Boy', Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 1, MELEE_SPEED),
    [Ork.Loota]: createUnit(Ork.Loota, "Loota", Faction.Orks, [
        { value: 1, type: 'range' },
        { value: 0, type: 'range' },
        { value: 0, type: 'range' },
        { value: 0, type: 'range' },
    ], 1, RANGE_SPEED, ['loot']),
    [Ork.Grot]: createUnit(Ork.Grot, "Grot", Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 0, type: 'melee' },
    ], 1, MELEE_SPEED, ['horde']),
    [Ork.Nob]: createUnit(Ork.Nob, "Nob", Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
    ], 2, 3, ['inspiring-melee']),
    [Ork.Warbike]: createUnit(Ork.Warbike, "Warbike", Faction.Orks, [
        { value: 1, type: 'melee' },
        { value: 1, type: 'melee' },
        { value: 0, type: 'melee' },
        { value: 1, type: 'melee' },
    ], 2, 3),
    [Ork.MadDokSurgery]: createModule(Ork.MadDokSurgery, 'Mad Dok\'s Surgery', Faction.Orks, 'When an adjacent friendly unit is destroyed, place it back in your hand instead of discarding it.'),
    [Ork.Battle]: createAction(Ork.Battle, 'Battle', Faction.Orks, 'attack', 'Triggers a battle'),
    [Ork.Push]: createAction(Ork.Push, 'Push', Faction.Orks, 'push', 'Pushes an enemy unit one space away'),
    [Ork.Move]: createAction(Ork.Move, 'Move', Faction.Orks, 'move', 'Moves a friendly unit to an adjacent space'),
};
