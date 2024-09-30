import { addInfluenceHeuristic } from "../store/ai";
import { instanciateRotatableObject } from "../store/army-utils";
import { initialGameState } from "../store/initial-state";
import { Tau } from "../store/tau/game-object-ids";


describe('ai', () => {
    describe('influenceHeurisitic', () => {
    it('should handle rotation', () => {
        const tile = instanciateRotatableObject(Tau.FireWarrior, 0);
        const stateClone = JSON.parse(JSON.stringify(initialGameState));
        
        // Empty all cells
        for (let row = 0; row < stateClone.board.length; row++) {
            for (let col = 0; col < stateClone.board[row].length; col++) {
                stateClone.board[row][col].tiles = [];
            }
        }

        stateClone.board[0][3].tiles.push(tile);
        const score = addInfluenceHeuristic(tile, stateClone);

        // Fire Warrior has three attacks, with default rotation it would only influence 3 cells
        expect(score).toBe(3);
    });

    });  
});