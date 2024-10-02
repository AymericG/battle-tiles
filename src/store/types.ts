import { Draft } from "@reduxjs/toolkit";
import { GameObjectInstance } from "../models/GameObject"
import { RotatableInstance } from "../models/Rotatable";
import { Ork } from "./ork/game-object-ids";
import { SpaceWolves } from "./spacewolves/game-object-ids";
import { Tau } from "./tau/game-object-ids";
import { GameState } from "../models/GameState";
import { Cell } from "../models/Cell";

export type GameObjectId = Tau | Ork | SpaceWolves;

export enum ActionParameter {
    AdjacentEmptyCell = 'adjacent-empty-cell',
    AdjacentEnemy = 'adjacent-enemy',
    Rotation = 'rotation',
}

export enum Relationship {
    Friendly = 'friendly',
    Enemy = 'enemy'
}

// Declare ActionTargetType in a fluent interface
export class ActionTargetType {
    public relationship: Relationship = Relationship.Friendly;
    public count = 1;
    public isCountExact = true;

    withRelationship(relationship: Relationship) {
        this.relationship = relationship;
        return this;
    }

    upTo(count: number) {
        this.count = count;
        this.isCountExact = false;
        return this;
    }
}



export enum ActionType {
    PLAY = 'play',
    DISCARD = 'discard'
}

export enum GameEvent {
    DESTROYED = 'destroyed',
    DAMAGED = 'damaged',
}

export type Ability = {
    event: GameEvent;
    description: string;
    execute: (self: RotatableInstance, destroyed: RotatableInstance, state: Draft<GameState>, effects: (() => void)[]) => any;
}

export enum AttackDirection {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
}

export type ActionParameters = {
    tile: RotatableInstance,
    target: Cell | RotatableInstance
    rotation: number
}

export type PossibleAction = {
    type: ActionType,
    tile: GameObjectInstance,
    x?: number,
    y?: number,
    rotation?: number,
    score: number
    params?: ActionParameters
}

export enum WallDirection {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
}