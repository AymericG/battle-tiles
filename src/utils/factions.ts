import { Faction } from "../models/Faction";

const factions = {
    [Faction.SpaceWolves]: { name: 'Space Wolves', color: 'lightblue' },
    [Faction.Orks]: { name: 'Orks', color: 'lightgreen' },
    [Faction.Tau]: { name: 'Tau', color: 'orange' }
};

export function getFactionColor(faction: Faction) {
    return factions[faction].color;
}

export function getFactionName(faction: Faction) {
    return factions[faction].name;
}