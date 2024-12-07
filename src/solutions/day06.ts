import { parseLines } from "../util/input";
import { Solution } from "../util/types";

const DIRECTIONS = {
  UP: { row: -1, col: 0 },
  RIGHT: { row: 0, col: 1 },
  DOWN: { row: 1, col: 0 },
  LEFT: { row: 0, col: -1 },
};

interface Guard {
  direction: 'UP'|'DOWN'|'LEFT'|'RIGHT';
  row: number;
  col: number;
}

// helper function to find the guard's position and direction
const findGuard = (grid: string[][]): Guard|null => {
  const line = grid.find(line => {
    const cellsOfInterest = line.filter(cell => {
      return cell !== '.' && cell !== '#';
    });
    return cellsOfInterest.length > 0;
  });

  if (!line) return null;

  const guardChar = line.filter(cell => {
    return cell !== '.' && cell !== '#';
  })[0];

  let direction: 'UP'|'DOWN'|'LEFT'|'RIGHT';
  switch (guardChar) {
    case '^':
      direction = 'UP';
      break;
    case '<':
      direction = 'LEFT';
      break;
    case '>':
      direction = 'RIGHT';
      break;
    default:
      direction = 'DOWN';
  }

  return {
    direction,
    row: grid.indexOf(line),
    col: line.indexOf(guardChar),
  };
}

// helper function to perform a movement
const doMove = (guard: Guard, grid: string[][]): {guard: Guard, moved: boolean, done: boolean} => {
  const direction = DIRECTIONS[guard.direction];

  const nextRow = guard.row + direction.row;
  const nextCol = guard.col + direction.col;

  // this move made us exit the grid, so we're done
  if (nextRow >= grid.length || nextCol >= grid[0].length || nextRow < 0 || nextCol < 0)
    return {
      done: true,
      moved: true,
      guard: {
        direction: guard.direction,
        row: nextRow,
        col: nextCol,
      }
    };

  const nextCell = grid[nextRow][nextCol];

  if (nextCell === '#' || nextCell === 'O') {
    const currDirIndex = Object.values(DIRECTIONS).indexOf(direction);
    const nextIndex = currDirIndex + 1 > 3 ? 0 : currDirIndex + 1;
    // we hit an obstacle, so we didn't move, just turned
    return {
      done: false,
      moved: false,
      guard: {
        direction: Object.keys(DIRECTIONS)[nextIndex] as 'UP'|'DOWN'|'LEFT'|'RIGHT',
        row: guard.row,
        col: guard.col,
      }
    }
  }

  // just a normal movement
  return {
    done: false,
    moved: true,
    guard: {
      direction: guard.direction,
      row: nextRow,
      col: nextCol,
    }
  }
}

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => line.split(''));

    let currGuard = findGuard(grid);

    if (!currGuard) return 0;

    let visitedCells: string[] = [`${currGuard.row},${currGuard.col}`];
    let inRange = true;
    while (inRange) {
      const {done, moved, guard} = doMove(currGuard, grid);
      // if we left the grid, we're done
      if (done) {
        break;
      }
      // if we moved and haven't been here before, note it
      if (moved) {
        if (!visitedCells.includes(`${guard.row},${guard.col}`)) {
          visitedCells.push(`${guard.row},${guard.col}`);
        }
      }
      currGuard = guard;
    }

    return visitedCells.length;
  },

  /* as with day 2, i'm sure there's a really clever way to do this,
   * but brute force is simple and works :)
   */
  part2: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => line.split(''));

    const potentialObstacles: string[] = [];
    // literally attempt placing an obstacle at every possible position
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] !== '.') continue;

        let currGuard = findGuard(grid);
        if (!currGuard) continue;

        grid[row][col] = 'O';

        // with the new obstacle, run the movements again
        let visitedCells: string[] = [`${currGuard.row},${currGuard.col},${currGuard.direction}`];
        let inRange = true;
        let inLoop = false;
        while (inRange) {
          const {done, moved, guard} = doMove(currGuard, grid);
          // we exited the grid, this spot didn't work
          if (done) {
            break;
          }
          if (moved) {
            if (!visitedCells.includes(`${guard.row},${guard.col},${guard.direction}`)) {
              // we moved and haven't been to this spot going this direction
              // before, note it and keep going
              visitedCells.push(`${guard.row},${guard.col},${guard.direction}`);
            } else {
              // we've been to this spot going this direction before,
              // meaning we've looped back to where we've been--this spot works
              inLoop = true;
              break;
            }
          }
          currGuard = guard;
        }

        if (inLoop) {
          potentialObstacles.push(`${row},${col}`);
        }

        grid[row][col] = '.';
      }
    }

    return potentialObstacles.length;
  }
};
