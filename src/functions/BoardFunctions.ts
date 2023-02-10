import { boardState } from "../tests/GameStateGenerator";
import { Direction } from "../types/strategy";
import { Battlesnake, Board, Coord, GameState } from "../types/types";

export function coordInDirection(start: Coord, direction: Direction): Coord {
  switch (direction) {
    case Direction.UP:
      return { x: start.x, y: start.y + 1 }
    case Direction.RIGHT:
      return { x: start.x + 1, y: start.y }
    case Direction.DOWN:
      return { x: start.x, y: start.y - 1 }
    case Direction.LEFT:
      return { x: start.x - 1, y: start.y }
  }
}

export function isNextToSnakeBody(coord: Coord, gamestate: GameState): boolean {
  const coords = [{x: coord.x+1, y: coord.y}, {x: coord.x, y: coord.y+1}, {x: coord.x-1, y: coord.y}, {x: coord.x, y: coord.y-1}]
  return coords.some((nextCoord, Coord) => {
    return gamestate.board.snakes.some((snake: Battlesnake) => {
      return isSnakePart({ x: nextCoord.x, y: nextCoord.y }, gamestate.board)
    })
  })
}

export function isNextToBorder(coord: Coord, gamestate: GameState): boolean {
  const coords = [{x: coord.x+1, y: coord.y}, {x: coord.x, y: coord.y+1}, {x: coord.x-1, y: coord.y}, {x: coord.x, y: coord.y-1}]
  return coords.some((nextCoord, Coord) => {
    return isOutside(nextCoord, gamestate.board)
  })
}

export function isNextToBiggerSnakeHead(coord: Coord, gamestate: GameState, snakeLenght: number): boolean {
  const coords = [{x: coord.x+1, y: coord.y}, {x: coord.x, y: coord.y+1}, {x: coord.x-1, y: coord.y}, {x: coord.x, y: coord.y-1}]
  return coords.some((nextCoord, Coord) => {
    if (sameCoord(nextCoord, gamestate.you.head)) return false
    return gamestate.board.snakes.some((snake: Battlesnake) => {
      return isBiggerSnakeHead({ x: nextCoord.x, y: nextCoord.y }, gamestate.board, snakeLenght)
    })
  })
}

export function isNexNexttToBiggerSnakeHead(coord: Coord, gamestate: GameState, snakeLenght: number): boolean {
  const coords = [{x: coord.x+1, y: coord.y}, {x: coord.x, y: coord.y+1}, {x: coord.x-1, y: coord.y}, {x: coord.x, y: coord.y-1}]
  return coords.some((nextCoord, coord) => {
    isNextToBiggerSnakeHead(nextCoord, gamestate, snakeLenght)
  })
}

export function isBiggerSnakeHead(coord: Coord, board: Board, snakeLenght: number): boolean {
  return board.snakes.some((snake: Battlesnake) => {
    return sameCoord(snake.head, coord) && snake.length >= snakeLenght
  })
}

export function isNextToSmallerSnakeHead(coord: Coord, gamestate: GameState, snakeLenght: number): boolean {
  const coords = [{x: coord.x+1, y: coord.y}, {x: coord.x, y: coord.y+1}, {x: coord.x-1, y: coord.y}, {x: coord.x, y: coord.y-1}]
  return coords.some((nextCoord, Coord) => {
    if (sameCoord(nextCoord, gamestate.you.head)) return false
    return gamestate.board.snakes.some((snake: Battlesnake) => {
      return isSmallerSnakeHead({ x: nextCoord.x, y: nextCoord.y }, gamestate.board, snakeLenght)
    })
  })
}

export function isSmallerSnakeHead(coord: Coord, board: Board, snakeLenght: number): boolean {
  return board.snakes.some((snake: Battlesnake) => {
    return sameCoord(snake.head, coord) && snake.length < snakeLenght
  })
}

export function isSnakePart(coord: Coord, board: Board): boolean {
  return board.snakes.some((snake: Battlesnake) => {
    if (sameCoord(snake.body[snake.body.length - 1], coord)) return false
    return snake.body.some((bodyPart: Coord) => sameCoord(bodyPart, coord));
  });
}

export function isOutside(coord: Coord, board: Board): boolean {
  return coord.y < 0 || coord.x < 0 || coord.x >= board.width || coord.y >= board.height;
}

export function sameCoord(coord1: Coord, coord2: Coord) {
  return coord1.x == coord2.x && coord1.y == coord2.y;
}

export function closestFood(head: Coord, board: Board): Coord | null {
  if (board.food.length == 0) {
    return null;
  }
  return board.food.sort((a, b) => distance(a, head) - distance(b, head))[0];
}

export function distance(coord1: Coord, coord2: Coord): number {
  return Math.abs(coord1.x - coord2.x) + Math.abs(coord2.y - coord1.y);
}