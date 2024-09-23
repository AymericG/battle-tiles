import { Faction } from "../../models/Faction";
import { instanciateGameObjects, instanciateRotatableObject, instanciateRotatableObjects, shuffle } from "../army-utils";
import { Tau } from "./game-object-ids";


export const createTauArmy = (playerId: number) => ({
    faction: Faction.Tau,
    base: instanciateRotatableObject(Tau.Leader, playerId),
    deck: shuffle([
        ...instanciateRotatableObjects(Tau.FireWarrior, playerId, 4),
        ...instanciateRotatableObjects(Tau.CrisisBattlesuit, playerId, 1),
        ...instanciateRotatableObjects(Tau.StealthSuit, playerId, 1),
        ...instanciateRotatableObjects(Tau.BroadsideBattlesuit, playerId, 1),
        ...instanciateRotatableObjects(Tau.KrootCarnivore, playerId, 4),
        ...instanciateGameObjects(Tau.Battle, playerId, 4),
        ...instanciateGameObjects(Tau.Move, playerId, 4),
        ...instanciateGameObjects(Tau.Push, playerId, 2),
        ...instanciateRotatableObjects(Tau.ShieldDrone, playerId, 2),
        
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