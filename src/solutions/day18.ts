import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Point {
  x: number;
  y: number;
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

// helper to find the shortest path to the finish. just a breadth-first search
const findPath = (grid: string[][], start: Point, finish: Point) => {
  const visited: string[] = [];
  const queue: PathPoint[] = [];

  visited.push(`${start.x},${start.y}`);
  queue.push({x: start.x, y: start.y});

  while (queue.length) {
    const curr = queue.shift() as PathPoint;

    if (curr.x === finish.x && curr.y === finish.y) {
      return curr;
    }

    Object.entries(DIRECTIONS).forEach(([_, delta]) => {
      const nextPoint = {
        x: curr.x + delta.x,
        y: curr.y + delta.y,
        parent: curr,
      };
      const nextKey = `${nextPoint.x},${nextPoint.y}`;
      if (
        nextPoint.x < 0 ||
        nextPoint.x >= grid[0].length ||
        nextPoint.y < 0 ||
        nextPoint.y >= grid.length ||
        grid[nextPoint.y][nextPoint.x] === '#'
      ) return false;
      if (!visited.includes(nextKey)) {
        visited.push(nextKey);
        queue.push(nextPoint);
      }
    });
  }

  return start as PathPoint;
}

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    // passing the grid size and byte counts with the input so i don't have
    // to swap out values for the test case
    const [width, height, byteCount] = lines.shift()!.split('x').map(Number);
    const grid: string[][] = [];
    for (let y = 0; y < height + 1; y++) {
      grid.push(new Array(width + 1).fill('.'));
    }

    const bytes: Point[] = lines.slice(0, byteCount).map(line => {
      const [x, y] = line.split(',').map(Number);
      return {x, y};
    });

    bytes.forEach(byte => {
      grid[byte.y][byte.x] = '#';
    });

    // run the BFS and count the path length
    let endPoint = findPath(grid, {x: 0, y: 0}, {x: width, y: height});
    let length = 0;
    while (endPoint.parent) {
      const parent = endPoint.parent;
      length++;
      endPoint = parent;
    }

    return length;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const [width, height, byteCount] = lines.shift()!.split('x').map(Number);
    const grid: string[][] = [];
    for (let y = 0; y < height + 1; y++) {
      grid.push(new Array(width + 1).fill('.'));
    }

    const bytes: Point[] = lines.map(line => {
      const [x, y] = line.split(',').map(Number);
      return {x, y};
    });

    bytes.slice(0, byteCount).forEach(byte => {
      grid[byte.y][byte.x] = '#';
    });

    // same story as part1 but now we step through the remaining bytes,
    // checking if a path still exists after every drop
    for (let i = byteCount; i < bytes.length; i++) {
      const byte = bytes[i];
      grid[byte.y][byte.x] = '#';
      const endPoint = findPath(grid, {x: 0, y: 0}, {x: width, y: height});
      if (!endPoint.parent) {
        return `${byte.x},${byte.y}`;
      }
    }

    return '0,0';
  }
};
