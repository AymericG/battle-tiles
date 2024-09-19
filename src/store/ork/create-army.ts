import { instanciateGameObjects, instanciateRotatableObject, instanciateRotatableObjects, shuffle } from "../army-utils";
import { Ork } from "./game-object-ids";

export const createOrkArmy = (playerId: number) => ({
    base: instanciateRotatableObject(Ork.Leader, playerId),
    deck: shuffle([
        ...instanciateRotatableObjects(Ork.Boy, playerId, 4),
        ...instanciateRotatableObjects(Ork.Loota, playerId, 4),
        ...instanciateRotatableObjects(Ork.Grot, playerId, 4),
        ...instanciateRotatableObjects(Ork.Nob, playerId, 2),
        ...instanciateRotatableObjects(Ork.Warbike, playerId, 2),
        ...instanciateGameObjects(Ork.Battle, playerId, 5),
        ...instanciateGameObjects(Ork.Move, playerId, 5),
        ...instanciateRotatableObjects(Ork.MadDokSurgery, playerId, 1),
        // ,
        // ,
        // createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        // createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        // createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        // createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        // createAction('Battle', playerId, Faction.Orks, 'attack', 'Battle'),
        // createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        // createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        // createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        // createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        // createAction('Move', playerId, Faction.Orks, 'move', 'Move'),
        // createAction('WAAAGH!', playerId, Faction.Orks, 'special', 'All your units gain +1 melee attack for this turn.'),
        // createAction('Mob Rule', playerId, Faction.Orks, 'special', 'Select one unit. It can attack twice this turn if it is adjacent to at least two other friendly units.'),
        // createModule('Charge!', playerId, Faction.Orks, 'Move up to three of your units to adjacent empty tiles and immediately trigger a battle.'),
        // createModule('Scrap Heap', playerId, Faction.Orks, 'Destroy one of your units to draw two additional tiles this turn.'),
        // createModule('Mekboy Workshop', playerId, Faction.Orks, 'Adjacent friendly units heal 1 health at the end of each turn.'),
    ])
});