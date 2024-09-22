import { Faction } from "../../models/Faction";
import { instanciateGameObjects, instanciateRotatableObject, instanciateRotatableObjects, shuffle } from "../army-utils";
import { SpaceWolves } from "./game-object-ids";

export const createSpaceWolvesArmy = (playerId: number) => ({
    faction: Faction.SpaceWolves,
    base: instanciateRotatableObject(SpaceWolves.Leader, playerId),
    deck: shuffle([
        ...instanciateRotatableObjects(SpaceWolves.FireWarrior, playerId, 4),
        ...instanciateRotatableObjects(SpaceWolves.CrisisBattlesuit, playerId, 1),
        ...instanciateRotatableObjects(SpaceWolves.StealthSuit, playerId, 1),
        ...instanciateRotatableObjects(SpaceWolves.BroadsideBattlesuit, playerId, 1),
        ...instanciateRotatableObjects(SpaceWolves.KrootCarnivore, playerId, 4),
        ...instanciateGameObjects(SpaceWolves.Battle, playerId, 4),
        ...instanciateGameObjects(SpaceWolves.Move, playerId, 4),
        ...instanciateGameObjects(SpaceWolves.Push, playerId, 2),
    ])
});