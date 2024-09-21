import { gameObjects as tau } from "./tau/game-objects";
import { gameObjects as ork } from "./ork/game-objects";
import { gameObjects as spaceWolves } from "./spacewolves/game-objects";

export const allGameObjects = {...tau, ...ork, ...spaceWolves};