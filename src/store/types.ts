import { Draft } from "@reduxjs/toolkit";
import { GameObjectInstance } from "../models/GameObject"
import { RotatableInstance } from "../models/Rotatable";
import { Ork } from "./ork/game-object-ids";
import { SpaceWolves } from "./spacewolves/game-object-ids";
import { Tau } from "./tau/game-object-ids";
import { GameState } from "../models/GameState";

export type GameObjectId = Tau | Ork | SpaceWolves;

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

export type PossibleAction = {
    type: ActionType,
    tile: GameObjectInstance,
    x?: number,
    y?: number,
    rotation?: number,
    score: number
    params?: {
        tile: RotatableInstance,
        x: number,
        y: number,
        rotation: number
    }
}

export enum WallDirection {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
}