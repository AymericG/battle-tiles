import { createAction, createModule, createUnit } from "../army-utils";
import { Faction } from "../../models/Faction";
import { LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../../constants";
import { Ork } from "./game-object-ids";
import { RotatableInstance } from "../../models/Rotatable";
import { GameEvent } from "../types";
import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../../models/GameState";
import { findTilePosition, moveTileToHand } from "../game-state-utils";
import { isAdjacent } from "../board-manipulation";
import { log } from "../../utils/log";

export const gameObjects = {
    [Ork.Leader]: createUnit(Ork.Leader, LEADER_UNIT, Faction.Orks, "1m 1m 1m 1m", 5, 1),
    [Ork.Boy]: createUnit(Ork.Boy, 'Ork Boy', Faction.Orks, "1m 0m 0m 1m", 1, MELEE_SPEED),
    [Ork.Loota]: createUnit(Ork.Loota, "Loota", Faction.Orks, "1r 0r 0r 0r", 1, RANGE_SPEED, ['loot']),
    [Ork.Grot]: createUnit(Ork.Grot, "Grot", Faction.Orks, "1m 0m 0m 0m", 1, MELEE_SPEED, ['horde']),
    [Ork.Nob]: createUnit(Ork.Nob, "Nob", Faction.Orks, "1m 0m 1m 0m", 2, 3, ['inspiring-melee']),
    [Ork.Warbike]: createUnit(Ork.Warbike, "Warbike", Faction.Orks, "1m 1m 0m 1m", 2, 3),
    [Ork.MadDokSurgery]: createModule({
        id: Ork.MadDokSurgery, 
        name: 'Mad Dok\'s Surgery', 
        faction: Faction.Orks, 
        abilities: [
            {
                event: GameEvent.DESTROYED,
                description: 'When an adjacent friendly unit is destroyed, place it back in your hand instead of discarding it.',
                execute: (self: RotatableInstance, destroyed: RotatableInstance, state: Draft<GameState>, effects: (() => void)[]) => {
                    if (destroyed.playerId !== self.playerId) {
                        log(`The destroyed unit is not friendly`);
                        return;
                    }
                    
                    const selfPosition = findTilePosition(self, state);
                    const destroyedPosition = findTilePosition(destroyed, state);
                    if (!selfPosition || !destroyedPosition || !isAdjacent(selfPosition, destroyedPosition)) {
                        log(`The destroyed unit is not adjacent`, selfPosition, destroyedPosition, selfPosition && destroyedPosition && isAdjacent(selfPosition, destroyedPosition));
                        return;
                    }

                    // We want to replace the default destroy effect
                    effects[0] = () => {
                        log(`Mad Dok's Surgery triggers for player ${self.playerId}`);
                        moveTileToHand(destroyed, destroyed.playerId, state);
                    }
                }
            }
        ]
    }),
    [Ork.Battle]: createAction(Ork.Battle, 'Battle', Faction.Orks, 'attack', 'Triggers a battle'),
    [Ork.Push]: createAction(Ork.Push, 'Push', Faction.Orks, 'push', 'Pushes an enemy unit one space away'),
    [Ork.Move]: createAction(Ork.Move, 'Move', Faction.Orks, 'move', 'Moves a friendly unit to an adjacent space'),
};
