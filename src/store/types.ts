import { GameObject } from "../models/GameObject"

export enum ActionType {
    PLAY = 'play',
    DISCARD = 'discard'
}

export enum AttackDirection {
    UP = 0,
    RIGHT = 1,
    DOWN = 2,
    LEFT = 3
}

export type PossibleAction = {
    type: ActionType,
    tile: GameObject,
    x?: number,
    y?: number,
    rotation?: number,
    score: number
}