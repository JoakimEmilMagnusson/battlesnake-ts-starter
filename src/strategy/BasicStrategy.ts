import { coordInDirection, isOutside } from "../functions/BoardFunctions";
import { Direction, Outcome } from "../types/strategy";
import { DirectionResult, Strategy } from "../types/strategyTypes";
import { GameState, MoveResponse } from "../types/types";

export class BasicStrategy implements Strategy {

  nextMove(gameState: GameState): MoveResponse {
    const head = gameState.you.body[0];

    // Loop over all possible direction and evualtate it
    const directionResults: Array<DirectionResult> = Object.values(Direction).map((direction: Direction) => {
      const nextCoord = coordInDirection(head, direction);
      const isOutofBounds = isOutside(nextCoord, gameState.board);
      // Check that you don't collide with any snake
      // Add more checks if needed
      
      let outcome = Outcome.ALIVE
      if (isOutofBounds) {
        outcome = Outcome.DEAD
      }

      // Collect data to use for sorting

      return { direction, outcome, otherData: 0 };
    });

    // Filter out all safe moves
    const safeMoves = directionResults.filter(({ direction, outcome }) => outcome == Outcome.ALIVE)
    if (safeMoves.length == 0) {
      console.log(`MOVE ${gameState.turn}: No safe moves detected! Moving down`);
      return { move: "down" };
    }

    // Sort you safe moves any way you like
    const nextMove = safeMoves.sort((a, b) => b.otherData - a.otherData)[0];

    console.log(`MOVE ${gameState.turn}: ${nextMove.direction}`)
    console.log('hej');
    return { move: nextMove.direction.toLocaleLowerCase() };

  }
}