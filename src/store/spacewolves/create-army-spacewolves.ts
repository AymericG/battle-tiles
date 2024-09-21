import { instanciateGameObjects, instanciateRotatableObject, instanciateRotatableObjects, shuffle } from "../army-utils";
import { SpaceWolves } from "./game-object-ids";

export const createSpaceWolvesArmy = (playerId: number) => ({
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
        
        // createAction('Kauyon Trap', playerId, Faction.Tau, 'special', 'Move one enemy unit to any unoccupied adjacent tile.'),
        // createAction('Mont’ka Strike', playerId, Faction.Tau, 'special', 'All units in one chosen row or column gain +1 attack for this turn.'),
        // createModule('Shield Drone', playerId, Faction.Tau, 'Adjacent friendly units gain +1 health.'),
        // createModule('Shield Drone', playerId, Faction.Tau, 'Adjacent friendly units gain +1 health.'),
        // createModule('Shield Drone', playerId, Faction.Tau, 'Adjacent friendly units gain +1 health.'),
        // createModule('Markerlight', playerId, Faction.Tau, 'Adjacent friendly units gain +1 ranged attack.'),
        // createModule('Markerlight', playerId, Faction.Tau, 'Adjacent friendly units gain +1 ranged attack.'),
        // createModule('Markerlight', playerId, Faction.Tau, 'Adjacent friendly units gain +1 ranged attack.'),
    ])
});