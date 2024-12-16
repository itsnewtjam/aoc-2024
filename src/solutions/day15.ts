import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Robot {
  x: number;
  y: number;
}

interface Point {
  row: number;
  col: number;
}

interface Directions {
  [char: string]: {
    row: number;
    col: number;
  };
}

const DIRECTIONS: Directions = {
  '^': { row: -1, col: 0 },
  '>': { row: 0, col: 1 },
  'v': { row: 1, col: 0 },
  '<': { row: 0, col: -1 },
};

// helper function to locate the robot
const findRobot = (grid: string[][]): Robot => {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '@') {
        return {
          x: c,
          y: r,
        };
      }
    }
  }

  return {x: 0, y: 0};
}

/* helper function to check if a two-wide box can be pushed. using a linear
 * breadth-first search to check for additional boxes, looking for either an
 * empty space to push into, or a wall to say we can't push
 */
const canMoveBigBox = (
  grid: string[][],
  left: number,
  right: number,
  row: number,
  direction: '^'|'v'|'<'|'>',
) => {
  const visited: string[] = [];
  const queue: Point[] = [];

  visited.push(`${row},${left}`);
  visited.push(`${row},${right}`);
  queue.push({row, col: left});
  queue.push({row, col: right});

  while (queue.length) {
    const curr = queue.shift() as Point;

    if (direction === '^') {
      if (grid[curr.row - 1][curr.col] === '#') return false;
      if (['[', ']'].includes(grid[curr.row - 1][curr.col])) {
        if (!visited.includes(`${curr.row - 1},${curr.col}`)) {
          visited.push(`${curr.row - 1},${curr.col}`);
          queue.push({row: curr.row - 1, col: curr.col});
        }
        if (grid[curr.row - 1][curr.col] === '[') {
          if (!visited.includes(`${curr.row - 1},${curr.col + 1}`)) {
            visited.push(`${curr.row - 1},${curr.col + 1}`);
            queue.push({row: curr.row - 1, col: curr.col + 1});
          }
        } else {
          if (!visited.includes(`${curr.row - 1},${curr.col - 1}`)) {
            visited.push(`${curr.row - 1},${curr.col - 1}`);
            queue.push({row: curr.row - 1, col: curr.col - 1});
          }
        }
      }
    }

    if (direction === 'v') {
      if (grid[curr.row + 1][curr.col] === '#') return false;
      if (['[', ']'].includes(grid[curr.row + 1][curr.col])) {
        if (!visited.includes(`${curr.row + 1},${curr.col}`)) {
          visited.push(`${curr.row + 1},${curr.col}`);
          queue.push({row: curr.row + 1, col: curr.col});
        }
        if (grid[curr.row + 1][curr.col] === '[') {
          if (!visited.includes(`${curr.row + 1},${curr.col + 1}`)) {
            visited.push(`${curr.row + 1},${curr.col + 1}`);
            queue.push({row: curr.row + 1, col: curr.col + 1});
          }
        } else {
          if (!visited.includes(`${curr.row + 1},${curr.col - 1}`)) {
            visited.push(`${curr.row + 1},${curr.col - 1}`);
            queue.push({row: curr.row + 1, col: curr.col - 1});
          }
        }
      }
    }

    if (direction === '<') {
      if (grid[curr.row][curr.col - 1] === '.') return true;
      if (grid[curr.row][curr.col - 2] === '#') return false;
      if (['[', ']'].includes(grid[curr.row][curr.col - 1])) {
        if (!visited.includes(`${curr.row},${curr.col - 1}`)) {
          visited.push(`${curr.row},${curr.col - 1}`);
          queue.push({row: curr.row, col: curr.col - 1});
        }
        if (!visited.includes(`${curr.row},${curr.col - 2}`)) {
          visited.push(`${curr.row},${curr.col - 2}`);
          queue.push({row: curr.row, col: curr.col - 2});
        }
      }
    }

    if (direction === '>') {
      if (grid[curr.row][curr.col + 1] === '.') return true;
      if (grid[curr.row][curr.col + 2] === '#') return false;
      if (['[', ']'].includes(grid[curr.row][curr.col + 1])) {
        if (!visited.includes(`${curr.row},${curr.col + 1}`)) {
          visited.push(`${curr.row},${curr.col + 1}`);
          queue.push({row: curr.row, col: curr.col + 1});
        }
        if (!visited.includes(`${curr.row},${curr.col + 2}`)) {
          visited.push(`${curr.row},${curr.col + 2}`);
          queue.push({row: curr.row, col: curr.col + 2});
        }
      }
    }
  }

  return true;
}

/* helper function to move two-wide boxes. recursively calls itself for
 * any additional boxes in the way so that the whole stack gets pushed
 */
const moveBigBox = (
  grid: string[][],
  left: number,
  right: number,
  row: number,
  direction: '^'|'v'|'<'|'>',
) => {
  if (direction === '^') {
    if (grid[row - 1][left] === ']') {
      moveBigBox(grid, left - 1, left, row - 1, direction);
    }
    if (grid[row - 1][right] === '[') {
      moveBigBox(grid, right, right + 1, row - 1, direction);
    }
    if (grid[row - 1][left] === '[') {
      moveBigBox(grid, left, right, row - 1, direction);
    }
    // actually move
    grid[row - 1][left] = '[';
    grid[row - 1][right] = ']';
    grid[row][left] = '.';
    grid[row][right] = '.';
  }

  if (direction === '<') {
    if (grid[row][left - 1] === ']') {
      moveBigBox(grid, left - 2, left - 1, row, direction);
    }
    // actually move
    grid[row][left - 1] = '[';
    grid[row][right - 1] = ']';
    grid[row][right] = '.';
  }

  if (direction === 'v') {
    if (grid[row + 1][left] === ']') {
      moveBigBox(grid, left - 1, left, row + 1, direction);
    }
    if (grid[row + 1][right] === '[') {
      moveBigBox(grid, right, right + 1, row + 1, direction);
    }
    if (grid[row + 1][left] === '[') {
      moveBigBox(grid, left, right, row + 1, direction);
    }
    // actually move
    grid[row + 1][left] = '[';
    grid[row + 1][right] = ']';
    grid[row][left] = '.';
    grid[row][right] = '.';
  }

  if (direction === '>') {
    if (grid[row][right + 1] === '[') {
      moveBigBox(grid, right + 1, right + 2, row, direction);
    }
    // actually move
    grid[row][left + 1] = '[';
    grid[row][right + 1] = ']';
    grid[row][left] = '.';
  }
}

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const grid: string[][] = [];
    while (true) {
      const line = lines.shift() as string;
      if (line.length === 0) break;
      grid.push(line.split(''));
    }
    const instructions = lines.join('').split('');

    const robot = findRobot(grid);

    instructions.forEach(inst => {
      let validMove = false;
      let distToSpace = 0;
      /* so here i'm crawling along the movement direction looking for either
       * an empty space or a wall. if there's an empty space, i get the number
       * of spaces between the robot and that space, i.e. how many objects we
       * have to shift
       */
      switch (inst) {
        case "^":
          for (let i = robot.y; i >= 0; i--) {
            if (grid[i][robot.x] === '#') break;
            if (grid[i][robot.x] === '.') {
              validMove = true;
              distToSpace = robot.y - i;
              break;
            }
          }
          break;
        case "<":
          for (let i = robot.x; i >= 0; i--) {
            if (grid[robot.y][i] === '#') break;
            if (grid[robot.y][i] === '.') {
              validMove = true;
              distToSpace = robot.x - i;
              break;
            }
          }
          break;
        case "v":
          for (let i = robot.y; i < grid.length; i++) {
            if (grid[i][robot.x] === '#') break;
            if (grid[i][robot.x] === '.') {
              validMove = true;
              distToSpace = i - robot.y;
              break;
            }
          }
          break;
        case ">":
          for (let i = robot.x; i < grid[0].length; i++) {
            if (grid[robot.y][i] === '#') break;
            if (grid[robot.y][i] === '.') {
              validMove = true;
              distToSpace = i - robot.x;
              break;
            }
          }
          break;
      }

      /* if we found an empty space, move from that space back to the robot,
       * shifting each object forward as we pass it
       */
      if (validMove) {
        switch (inst) {
          case '^':
            for (let i = distToSpace; i > 0; i--) {
              const objToMove = grid[robot.y - i + 1][robot.x];
              grid[robot.y - i][robot.x] = objToMove;
            }
            break;
          case '<':
            for (let i = distToSpace; i > 0; i--) {
              const objToMove = grid[robot.y][robot.x - i + 1];
              grid[robot.y][robot.x - i] = objToMove;
            }
            break;
          case 'v':
            for (let i = distToSpace; i > 0; i--) {
              const objToMove = grid[robot.y + i - 1][robot.x];
              grid[robot.y + i][robot.x] = objToMove;
            }
            break;
          case '>':
            for (let i = distToSpace; i > 0; i--) {
              const objToMove = grid[robot.y][robot.x + i - 1];
              grid[robot.y][robot.x + i] = objToMove;
            }
            break;
        }
        // clearing the robot's old space
        grid[robot.y][robot.x] = '.';

        const dir = DIRECTIONS[inst];
        robot.x += dir.col;
        robot.y += dir.row;
      }
    });

    // now we just total up the boxes' gps coords
    let total = 0;
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col !== 'O') return;
        
        total += 100 * rowIdx + colIdx;
      });
    });

    return total;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const grid: string[][] = [];
    while (true) {
      const line = lines.shift() as string;
      if (line.length === 0) break;
      grid.push(line.split('').map(cell => {
        switch (cell) {
          case '#':
            return '##';
          case 'O':
            return '[]';
          case '.':
            return '..';
          case '@':
            return '@.';
        }
      }).join('').split(''));
    }
    const instructions = lines.join('').split('');

    const robot = findRobot(grid);

    instructions.forEach(inst => {
      let validMove = false;
      let nextSpace;
      let leftSide = 0;
      switch (inst) {
        case "^":
          nextSpace = grid[robot.y - 1][robot.x];
          if (nextSpace === '#') break;
          if (nextSpace === '.') {
            validMove = true;
            break;
          }
          /* so now that we have two-wide boxes to deal with, we have to get
           * both the left ([) and right (]) sides of the box to check if we
           * can push and therefore move
           */
          leftSide = nextSpace === '[' ? robot.x : robot.x - 1;
          if (canMoveBigBox(grid, leftSide, leftSide + 1, robot.y - 1, inst)) {
            validMove = true;
            break;
          }
          break;
        case "<":
          nextSpace = grid[robot.y][robot.x - 1];
          if (nextSpace === '#') break;
          if (nextSpace === '.') {
            validMove = true;
            break;
          }
          if (canMoveBigBox(grid, robot.x - 2, robot.x - 1, robot.y, inst)) {
            validMove = true;
            break;
          }
          break;
        case "v":
          nextSpace = grid[robot.y + 1][robot.x];
          if (nextSpace === '#') break;
          if (nextSpace === '.') {
            validMove = true;
            break;
          }
          leftSide = nextSpace === '[' ? robot.x : robot.x - 1;
          if (canMoveBigBox(grid, leftSide, leftSide + 1, robot.y + 1, inst)) {
            validMove = true;
            break;
          }
          break;
        case ">":
          nextSpace = grid[robot.y][robot.x + 1];
          if (nextSpace === '#') break;
          if (nextSpace === '.') {
            validMove = true;
            break;
          }
          if (canMoveBigBox(grid, robot.x + 1, robot.x + 2, robot.y, inst)) {
            validMove = true;
            break;
          }
          break;
      }

      /* if we are able to move, call the recursive helper to shift all the
       * boxes in the way
       */
      if (validMove) {
        if (nextSpace !== '.') {
          switch (inst) {
            case '^':
              moveBigBox(grid, leftSide, leftSide + 1, robot.y - 1, inst);
              break;
            case '<':
              moveBigBox(grid, robot.x - 2, robot.x - 1, robot.y, inst);
              break;
            case 'v':
              moveBigBox(grid, leftSide, leftSide + 1, robot.y + 1, inst);
              break;
            case '>':
              moveBigBox(grid, robot.x + 1, robot.x + 2, robot.y, inst);
              break;
          }
        } 
        grid[robot.y][robot.x] = '.';

        const dir = DIRECTIONS[inst];
        robot.x += dir.col;
        robot.y += dir.row;
        grid[robot.y][robot.x] = '@';
      }
    });

    // now just total up again, this time just grabbing the left side of boxes
    let total = 0;
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col !== '[') return;
        
        total += 100 * rowIdx + colIdx;
      });
    });

    return total;

  }
};
