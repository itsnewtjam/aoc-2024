import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Point {
  x: number;
  y: number;
}

interface DistPoint extends Point {
  distance: number;
}

interface PathPoint extends Point {
  parent?: PathPoint;
}

interface Directions {
  [char: string]: {
    x: number;
    y: number;
  };
}

const DIRECTIONS: Directions = {
  '^': { x: 0, y: -1},
  '>': { x: 1, y: 0},
  'v': { x: 0, y: 1},
  '<': { x: -1, y: 0},
};

// helper function to get the coordinates of start and finish
const findStartFinish = (grid: string[][]) => {
  let start: Point|null = null;
  let finish: Point|null = null;
  grid.forEach((row, rowIdx) => {
    row.forEach((col, colIdx) => {
      if (col === 'S') {
        start = {x: colIdx, y: rowIdx};
      }
      if (col === 'E') {
        finish = {x: colIdx, y: rowIdx};
      }

      if (start && finish) {
        return {start, finish};
      }
    });
  });

  return {start, finish};
}

/* this function takes the race grid and follows the path, creating a grid
 * where each point on the path is marked with its distance from the starting
 * point
 */
const fillDistances = (grid: string[][], start: Point) => {
  const visited: string[] = [];
  const queue: DistPoint[] = [];
  const distGrid: number[][] = grid.map(row => new Array(row.length).fill(0));

  visited.push(`${start.x},${start.y}`);
  queue.push({x: start.x, y: start.y, distance: 0});

  while (queue.length) {
    const curr = queue.shift() as DistPoint;

    Object.entries(DIRECTIONS).forEach(([_, delta]) => {
      const nextPoint = {
        x: curr.x + delta.x,
        y: curr.y + delta.y,
        distance: curr.distance + 1,
      };
      const nextKey = `${nextPoint.x},${nextPoint.y}`;
      if (grid[nextPoint.y][nextPoint.x] === '#') {
        distGrid[nextPoint.y][nextPoint.x] = -1;
      }

      const moveValid = !(
        nextPoint.x < 0 ||
        nextPoint.x >= grid[0].length ||
        nextPoint.y < 0 ||
        nextPoint.y >= grid.length ||
        grid[nextPoint.y][nextPoint.x] === '#'
      );
      if (moveValid && !visited.includes(nextKey)) {
        distGrid[nextPoint.y][nextPoint.x] = nextPoint.distance;
        visited.push(nextKey);
        queue.push(nextPoint);
      }
    });
  }

  return distGrid;
}

/* this function takes the grid of path distances from fillDistances() and
 * walks the path again, and at each point checks through all points within
 * cheat distance. if that point saves enough time, note it
 */
const findCheatPaths = (
  grid: number[][],
  start: Point,
  finish: Point,
  minSavings: number,
  maxCheatLength: number = 2,
) => {
  const visited: string[] = [];
  const queue: PathPoint[] = [];
  let validCheats = new Set<string>();

  visited.push(`${start.x},${start.y}`);
  queue.push({x: start.x, y: start.y});

  while (queue.length) {
    const curr = queue.shift() as PathPoint;

    // this point is not on the path
    if (grid[curr.y][curr.x] < 0) continue;

    // we're done, get outta here
    if (curr.x === finish.x && curr.y === finish.y) {
      return validCheats;
    }

    // here's where we check cheat-able points. i just run through the whole
    // grid again because most of them will be getting skipped anyways
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        // same point, skip this one
        if (
          colIdx === curr.x && rowIdx === curr.y ||
          col < 0
        ) return;

        // here i check the taxi distance between where we are and the
        // cheat-able point to make sure it's within range
        const cheatLength = Math.abs(curr.x - colIdx) + Math.abs(curr.y - rowIdx);
        if (cheatLength > maxCheatLength) return;

        // we can jump here, so now just check if this jump saves enough time
        const currDistance = grid[curr.y][curr.x];
        const cheatDistance = grid[rowIdx][colIdx];
        if (cheatDistance > 0 && cheatDistance - currDistance - cheatLength >= minSavings) {
          validCheats.add(`${currDistance},${cheatDistance}`);
        }
      });
    });

    // just normal bfs stuff from here to keep crawling the path
    Object.entries(DIRECTIONS).forEach(([_, delta]) => {
      const nextPoint = {
        x: curr.x + delta.x,
        y: curr.y + delta.y,
        parent: curr,
      };
      const nextKey = `${nextPoint.x},${nextPoint.y}`;

      const moveValid = !(
        nextPoint.x < 0 ||
        nextPoint.x >= grid[0].length ||
        nextPoint.y < 0 ||
        nextPoint.y >= grid.length ||
        grid[nextPoint.y][nextPoint.x] <= 0
      );
      if (moveValid && !visited.includes(nextKey)) {
        visited.push(nextKey);
        queue.push(nextPoint);
      }
    });
  }

  return validCheats;
};

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => line.split(''));

    const {start, finish} = findStartFinish(grid);
    if (!start || !finish) return -1;

    const distGrid = fillDistances(grid, start);

    const cheatPaths = findCheatPaths(distGrid, start, finish, 100, 2);

    return cheatPaths.size;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => line.split(''));

    const {start, finish} = findStartFinish(grid);
    if (!start || !finish) return -1;

    const distGrid = fillDistances(grid, start);

    const cheatPaths = findCheatPaths(distGrid, start, finish, 100, 20);

    return cheatPaths.size;
  }
};
