import { closestFood, coordInDirection, isOutside, isSnakePart, distance, isNextToBiggerSnakeHead, isNexNexttToBiggerSnakeHead, isNextToSmallerSnakeHead, isNextToSnakeBody, isNextToBorder} from "../functions/BoardFunctions";
import { reachableCells } from "../functions/ReachableCells";
import { boardState } from "../tests/GameStateGenerator";
import { Direction, Outcome } from "../types/strategy";
import { DirectionResult, Strategy } from "../types/strategyTypes";
import { GameState, MoveResponse } from "../types/types";

export class KweekendStrategy implements Strategy {

  nextMove(gameState: GameState): MoveResponse {
    const head = gameState.you.body[0];

    // Loop over all possible direction and evualtate it
    const directionResults: Array<DirectionResult> = Object.values(Direction).map((direction: Direction) => {
      const nextCoord = coordInDirection(head, direction);
      const isOutofBounds = isOutside(nextCoord, gameState.board);
      const isSnakeBody = isSnakePart(nextCoord, gameState.board)
      // Check that you don't collide with any snake
      // Add more checks if needed

      // If snake reaches the end of the board game && if its a safe turn && turn
      let outcome = Outcome.ALIVE
      if (isOutofBounds || isSnakeBody) {
        outcome = Outcome.DEAD
      }

      let biggerSnakeScore = isNextToBiggerSnakeHead(nextCoord, gameState, gameState.you.length) ? 100 : 0
      biggerSnakeScore += isNexNexttToBiggerSnakeHead(nextCoord, gameState, gameState.you.length) ? 20 : 0
      let smallerSnakeScore = isNextToSmallerSnakeHead(nextCoord, gameState, gameState.you.length) ? 100 : 0
      let nextToSnakeBodyScore = isNextToSnakeBody(nextCoord, gameState) ? 2 : 0
      let nextToBorderScore = isNextToBorder(nextCoord, gameState) ? 1 : 0
   
      // Find nearest food, get food's coords && find distance from head to nearest food's coord
      let closestFoodCoord = closestFood(head, gameState.board)
      let closestFoodDistance = closestFoodCoord ? distance(closestFoodCoord, nextCoord) : 0

      // Collect data to use for sorting
      let score = reachableCells(gameState.board, nextCoord) + (10 - closestFoodDistance) + smallerSnakeScore - biggerSnakeScore - nextToSnakeBodyScore - nextToBorderScore

      return { direction, outcome, otherData: score };
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
    return { move: nextMove.direction.toLocaleLowerCase() };

  }
}