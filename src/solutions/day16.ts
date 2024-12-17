import { parseLines } from "../util/input";
import { Solution } from "../util/types";

type Direction = '^'|'v'|'<'|'>';

interface Location {
  row: number;
  col: number;
  parent?: Location;
  direction?: Direction;
}

interface WeightedLocation extends Location {
  direction: Direction;
  cost: number;
}

interface PathLocation extends WeightedLocation {
  path: Location[];
}

const DIRECTIONS = {
  '^': {x: 0, y: -1},
  'v': {x: 0, y: 1},
  '<': {x: -1, y: 0},
  '>': {x: 1, y: 0},
};

const DIRECTION_INVERSE = {
  '^': 'v',
  'v': '^',
  '<': '>',
  '>': '<',
};

// helper function to find the start
const findStart = (grid: string[][]) => {
  let sRow, sCol;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 'S') {
        sRow = r;
        sCol = c;
        break;
      }
    }
    if (sRow) break;
  }

  return {row: sRow ?? 0, col: sCol ?? 0};
}

/* helper to find the optimal score for the maze. running dijkstra
 */
const findOptimalScore = (maze: string[][], start: Location) => {
  const visited: string[] = [];
  const queue: WeightedLocation[] = [];

  visited.push(`${start.row},${start.col}`);
  queue.push({...start, direction: '>', cost: 0});

  let score = 0;
  while (queue.length) {
    queue.sort((a, b) => a.cost - b.cost);
    const curr = queue.shift() as WeightedLocation;

    // we hit the end, eject and return the score
    if (maze[curr.row][curr.col] === 'E') {
      score = curr.cost;
      break;
    }

    Object.entries(DIRECTIONS).forEach(([dir, delta]) => {
      const next = {row: curr.row + delta.y, col: curr.col + delta.x};
      const nextKey = `${next.row},${next.col}`;
      if (maze[next.row][next.col] === '#') return;
      if (!visited.includes(nextKey)) {
        visited.push(nextKey);
        queue.push({
          row: next.row,
          col: next.col,
          parent: curr,
          direction: dir as Direction,
          cost: curr.cost + (curr.direction === dir ? 1 : 1001),
        });
      }
    });
  }

  return score;
}

// helper function to walk the maze finding all optimal paths
const walkMaze = (maze: string[][], start: Location, optimal: number) => {
  const queue: PathLocation[] = [{
    row: start.row,
    col: start.col,
    direction: '>',
    cost: 0, 
    path: [start],
  }];
  const visited = new Map<string,number>();
  const paths: Location[][] = [];

  while (queue.length) {
    const curr = queue.shift()!;
    const currKey = `${curr.row},${curr.col},${curr.direction}`;
    
    // this path is not optimal, skip
    if (curr.cost > optimal) continue;
    // we've seen a better path, skip
    if (visited.has(currKey) && visited.get(currKey)! < curr.cost) continue;

    visited.set(currKey, curr.cost);

    // we hit the end, record this path
    if (maze[curr.row][curr.col] === 'E') {
      paths.push(curr.path);
      continue;
    }

    // add all valid directions to the queue
    Object.entries(DIRECTIONS).forEach(([dir, delta]) => {
      const next = {row: curr.row + delta.y, col: curr.col + delta.x};
      if (
        dir === DIRECTION_INVERSE[curr.direction] ||
        maze[next.row][next.col] === '#'
      ) return;

      if (dir === curr.direction) {
        queue.push({
          row: next.row,
          col: next.col,
          direction: dir as Direction,
          cost: curr.cost + 1,
          path: [...curr.path, {row: next.row, col: next.col}],
        });
      } else {
        queue.push({
          row: next.row,
          col: next.col,
          direction: dir as Direction,
          cost: curr.cost + 1000,
          path: [...curr.path, {row: next.row, col: next.col}],
        });
      }
    });
  }

  return paths;
}

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const maze = lines.map(line => line.split(''));

    const start = findStart(maze); 

    const score = findOptimalScore(maze, start);

    return score;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const maze = lines.map(line => line.split(''));

    const start = findStart(maze); 

    const optimal = findOptimalScore(maze, start);
    const paths = walkMaze(maze, start, optimal);

    paths.forEach(path => {
      path.forEach(loc => {
        maze[loc.row][loc.col] = 'O';
      });
    });

    let seats = 0;
    maze.forEach(row => {
      row.forEach(col => {
        if (col === 'O') seats++;
      });
    });

    return seats;
  }
};
