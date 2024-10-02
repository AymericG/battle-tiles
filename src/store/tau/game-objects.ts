import { createAction, createModule, createUnit } from "../army-utils";
import { Faction } from "../../models/Faction";
import { BOARD_SIZE, LEADER_UNIT, MELEE_SPEED, RANGE_SPEED } from "../../constants";
import { Tau } from "./game-object-ids";
import { ActionParameter, ActionTargetType, GameEvent, Relationship } from "../types";
import { RotatableInstance } from "../../models/Rotatable";
import { Draft } from "@reduxjs/toolkit";
import { GameState } from "../../models/GameState";
import { log } from "../../utils/log";
import { discardAsPlayer, findTilePosition } from "../game-state-utils";
import { isAdjacent } from "../board-manipulation";
import { Cell } from "../../models/Cell";

export const gameObjects = {
    [Tau.Leader]: createUnit(Tau.Leader, LEADER_UNIT, Faction.Tau, "1m 1m 1m 1m", 5, 1),
    [Tau.FireWarrior]: createUnit(Tau.FireWarrior, 'Fire Warrior', Faction.Tau, "1r 1r 0r 1r", RANGE_SPEED, 1),
    [Tau.KrootCarnivore]: createUnit(Tau.KrootCarnivore, "Kroot Carnivore", Faction.Tau, "1m 1m 0m 1m", 1, MELEE_SPEED, ['horde']),
    [Tau.CrisisBattlesuit]: createUnit(Tau.CrisisBattlesuit, "Crisis Battlesuit", Faction.Tau, "1r 1r 0m 1r", 2, RANGE_SPEED),
    [Tau.StealthSuit]: createUnit(Tau.StealthSuit, "Stealth Suit", Faction.Tau, "1r 0m 0m 1r", 1, 3, ['stealthy']),
    [Tau.BroadsideBattlesuit]: createUnit(Tau.BroadsideBattlesuit, "Broadside Battlesuit", Faction.Tau, "1r 1r 1r 0r", 2, RANGE_SPEED),
    [Tau.Battle]: createAction({ 
        id: Tau.Battle, 
        name: 'Battle', 
        faction: Faction.Tau, 
        actionType: 'attack', 
        description: 'Triggers a battle' }),
    [Tau.Push]: createAction({ 
        id: Tau.Push, 
        name: 'Push', 
        faction: Faction.Tau, 
        actionType: 'push', 
        actionTarget: new ActionTargetType().withRelationship(Relationship.Enemy),
        actionParameters: [
            ActionParameter.AdjacentEmptyCell
        ],
        isActionValid: (self: RotatableInstance, parameters: any[], state: GameState) => {
            const selfPosition = findTilePosition(self, state);
            if (!selfPosition) {
                return false;
            }
            // There should be an enemy on the opposite side from the target
            const targetCell = parameters[0] as Cell;
            const dx = targetCell.x - selfPosition.x;
            const dy = targetCell.y - selfPosition.y;
            if (selfPosition.y - dy < 0 || selfPosition.y - dy >= BOARD_SIZE || selfPosition.x - dx < 0 || selfPosition.x - dx >= BOARD_SIZE) {
                return false;
            }
            const oppositeCell = state.board[selfPosition.y - dy][selfPosition.x - dx];
            const containsEnemy = oppositeCell.tiles.some(t => t.playerId !== self.playerId);
            return containsEnemy;
        },
        description: 'Pushes an enemy unit one space away' 
    }),
    [Tau.Move]: createAction({ 
        id: Tau.Move, 
        name: 'Move', 
        faction: Faction.Tau, 
        actionType: 'move', 
        actionTarget: new ActionTargetType().withRelationship(Relationship.Friendly),
        actionParameters: [
            ActionParameter.AdjacentEmptyCell,
            ActionParameter.Rotation
        ],
        description: 'Moves a friendly unit to an adjacent space'
    }),
    [Tau.ShieldDrone]: createModule({
        id: Tau.ShieldDrone, 
        name: 'Shield Drone', 
        faction: Faction.Tau, 
        abilities: [
            {
                event: GameEvent.DAMAGED,
                description: 'When an adjacent friendly unit is damaged, destroy this drone instead.',
                execute: (self: RotatableInstance, damaged: RotatableInstance, state: Draft<GameState>, effects: (() => void)[]) => {
                    if (damaged.playerId !== self.playerId) {
                        return;
                    }
                    
                    const selfPosition = findTilePosition(self, state);
                    const damagedPosition = findTilePosition(damaged, state);
                    if (!selfPosition || !damagedPosition || !isAdjacent(selfPosition, damagedPosition)) {
                        log(`The damaged unit is not adjacent`, selfPosition, damagedPosition, selfPosition && damagedPosition && isAdjacent(selfPosition, damagedPosition));
                        return;
                    }

                    // We want to replace the default damage effect
                    effects[0] = () => {
                        log(`Shield drone triggers for player ${self.playerId}`);
                        discardAsPlayer(self.playerId, self, state);
                    }
                }
            }
        ]
    }),
};
