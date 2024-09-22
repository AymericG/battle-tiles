import { createAction, createUnit } from "../army-utils";
import { Faction } from "../../models/Faction";
import { LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../../constants";
import { Tau } from "./game-object-ids";

export const gameObjects = {
    [Tau.Leader]: createUnit(Tau.Leader, LEADER_UNIT, Faction.Tau, "1m 1m 1m 1m", 5, 1),
    [Tau.FireWarrior]: createUnit(Tau.FireWarrior, 'Fire Warrior', Faction.Tau, "1r 1r 0r 1r", RANGE_SPEED, 1),
    [Tau.KrootCarnivore]: createUnit(Tau.KrootCarnivore, "Kroot Carnivore", Faction.Tau, "1m 1m 0m 1m", 1, MELEE_SPEED, ['horde']),
    [Tau.CrisisBattlesuit]: createUnit(Tau.CrisisBattlesuit, "Crisis Battlesuit", Faction.Tau, "1r 1r 0m 1r", 2, RANGE_SPEED),
    [Tau.StealthSuit]: createUnit(Tau.StealthSuit, "Stealth Suit", Faction.Tau, "1r 0m 0m 1r", 1, 3, ['stealthy']),
    [Tau.BroadsideBattlesuit]: createUnit(Tau.BroadsideBattlesuit, "Broadside Battlesuit", Faction.Tau, "1r 1r 1r 0r", 2, RANGE_SPEED),
    [Tau.Battle]: createAction(Tau.Battle, 'Battle', Faction.Tau, 'attack', 'Triggers a battle'),
    [Tau.Push]: createAction(Tau.Push, 'Push', Faction.Tau, 'push', 'Pushes an enemy unit one space away'),
    [Tau.Move]: createAction(Tau.Move, 'Move', Faction.Tau, 'move', 'Moves a friendly unit to an adjacent space'),
};
