import { parseLines } from "../util/input";
import { Solution } from "../util/types";

const STRING_TO_FIND = 'XMAS';
const DIRECTIONS = {
  UP: {
    row: -1,
    col: 0,
  },
  DOWN: {
    row: 1,
    col: 0,
  },
  LEFT: {
    row: 0,
    col: -1,
  },
  RIGHT: {
    row: 0,
    col: 1,
  },
  UPLEFT: {
    row: -1,
    col: -1,
  },
  UPRIGHT: {
    row: -1,
    col: 1,
  },
  DOWNLEFT: {
    row: 1,
    col: -1,
  },
  DOWNRIGHT: {
    row: 1,
    col: 1,
  },
};

type Direction = 'UP'|'DOWN'|'LEFT'|'RIGHT'|'UPLEFT'|'UPRIGHT'|'DOWNLEFT'|'DOWNRIGHT';

const checkDirection = (dir: Direction, grid: string[][], row: number, col: number) => {
  const direction = DIRECTIONS[dir];
  if (
    (direction.col > 0 ? col <= grid.length - STRING_TO_FIND.length : true) &&
    (direction.col < 0 ? col >= STRING_TO_FIND.length - 1: true) &&
    (direction.row > 0 ? row <= grid[0].length - STRING_TO_FIND.length : true) &&
    (direction.row < 0 ? row >= STRING_TO_FIND.length - 1 : true)
  ) {
    for (let i = 0; i < STRING_TO_FIND.length; i++) {
      if (grid[row + (direction.row * i)][col + (direction.col * i)] !== STRING_TO_FIND[i])
        return false;
    }
    return true;
  }
}

const checkMAS = (grid: string[][], row: number, col: number) => {
  const dirs = ['UPLEFT', 'UPRIGHT', 'DOWNLEFT', 'DOWNRIGHT'];
  const corners: string[] = [];
  dirs.forEach(dir => {
    const direction = DIRECTIONS[dir as Direction];
    const value = grid[row + direction.row][col + direction.col];
    if (value === 'M' || value === 'S') {
      corners.push(value);
    }
  });
  return (
    corners.length === 4 &&
    corners.filter(corner => corner === 'M').length === 2 &&
    corners.filter(corner => corner === 'S').length === 2 &&
    corners[0] !== corners[3] &&
    corners[1] !== corners[2]
  );
}

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => {
      return line.split('');
    });

    let instances = 0;
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col === STRING_TO_FIND[0]) {
          Object.entries(DIRECTIONS).forEach(([dir]) => {
            if (checkDirection(dir as Direction, grid, rowIdx, colIdx)) {
              instances++;
            }
          });
        }
      });
    });

    return instances;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => {
      return line.split('');
    });

    let instances = 0;
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col === 'A' && rowIdx > 0 && rowIdx < grid.length - 1 && colIdx > 0 && colIdx < row.length - 1) {
          if (checkMAS(grid, rowIdx, colIdx)) {
            instances++;
          }
        }
      });
    });

    return instances;
  },
};
