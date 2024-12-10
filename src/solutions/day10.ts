import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Point {
  row: number;
  col: number;
}

/* helper function to count the number of trails from a point.
 * just runs a breadth-first search from the origin, only moving if
 * the next vertex's value is 1 greater than the current one (so
 * a trail is 0-9)
 */
const findTrails = (map: string[][], point: Point) => {
  const visited: string[] = [];
  const queue: Point[] = [];

  visited.push(`${point.row},${point.col}`);
  queue.push(point);

  while (queue.length) {
    const curr = queue.shift() as Point;
    const currValue = Number(map[curr.row][curr.col]);

    // up
    if (
      curr.row - 1 >= 0 &&
      Number(map[curr.row - 1][curr.col]) === currValue + 1
    ) {
      if (!visited.includes(`${curr.row - 1},${curr.col}`)) {
        visited.push(`${curr.row - 1},${curr.col}`);
        queue.push({row: curr.row - 1, col: curr.col});
      }
    }

    // down
    if (
      curr.row + 1 < map.length &&
      Number(map[curr.row + 1][curr.col]) === currValue + 1
    ) {
      if (!visited.includes(`${curr.row + 1},${curr.col}`)) {
        visited.push(`${curr.row + 1},${curr.col}`);
        queue.push({row: curr.row + 1, col: curr.col});
      }
    }

    // left
    if (
      curr.col >= 0 &&
      Number(map[curr.row][curr.col - 1]) === currValue + 1
    ) {
      if (!visited.includes(`${curr.row},${curr.col - 1}`)) {
        visited.push(`${curr.row},${curr.col - 1}`);
        queue.push({row: curr.row, col: curr.col - 1});
      }
    }

    // right
    if (
      curr.col < map[0].length &&
      Number(map[curr.row][curr.col + 1]) === currValue + 1
    ) {
      if (!visited.includes(`${curr.row},${curr.col + 1}`)) {
        visited.push(`${curr.row},${curr.col + 1}`);
        queue.push({row: curr.row, col: curr.col + 1});
      }
    }
  }

  // for the return, i'm just counting how many 9's we reached
  return visited.filter(point => {
    const [row, col] = point.split(',').map(Number);

    return map[row][col] === '9';
  }).length;
};

/* helper function to count the number of unique trails from a point.
 * underlying logic is similar to findTrails() above, only through the
 * breadth-first search i keep track of the paths so far, rather than just
 * the visited points.
 */
const findUniqueTrails = (map: string[][], point: Point) => {
  const paths: Point[][] = [];
  const queue: Point[][] = [[point]];

  while (queue.length) {
    // we're tracking whole paths, so pop the top path and get the last point
    const currPath = queue.shift() as Point[];
    const curr = currPath[currPath.length - 1];
    const currValue = Number(map[curr.row][curr.col]);

    // if the last point is a 9, this path is complete, so
    // add it to the list of paths and move on
    if (currValue === 9) {
      paths.push(currPath);
      continue;
    }

    // up
    if (
      curr.row - 1 >= 0 &&
      Number(map[curr.row - 1][curr.col]) === currValue + 1
    ) {
      if (!currPath.find(point => point.row === curr.row - 1 && point.col === curr.col)) {
        const newPath = [...currPath, {row: curr.row - 1, col: curr.col}];
        queue.push(newPath);
      }
    }

    // down
    if (
      curr.row + 1 < map.length &&
      Number(map[curr.row + 1][curr.col]) === currValue + 1
    ) {
      if (!currPath.find(point => point.row === curr.row + 1 && point.col === curr.col)) {
        const newPath = [...currPath, {row: curr.row + 1, col: curr.col}];
        queue.push(newPath);
      }
    }

    // left
    if (
      curr.col >= 0 &&
      Number(map[curr.row][curr.col - 1]) === currValue + 1
    ) {
      if (!currPath.find(point => point.row === curr.row && point.col === curr.col - 1)) {
        const newPath = [...currPath, {row: curr.row, col: curr.col - 1}];
        queue.push(newPath);
      }
    }

    // right
    if (
      curr.col < map[0].length &&
      Number(map[curr.row][curr.col + 1]) === currValue + 1
    ) {
      if (!currPath.find(point => point.row === curr.row && point.col === curr.col + 1)) {
        const newPath = [...currPath, {row: curr.row, col: curr.col + 1}];
        queue.push(newPath);
      }
    }
  }

  return paths.length;
};

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const map: string[][] = lines.map(line => line.split(''));

    let trails = 0;
    map.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col !== '0') return;

        trails += findTrails(map, {row: rowIdx, col: colIdx});
      });
    });

    return trails;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const map: string[][] = lines.map(line => line.split(''));

    let trails = 0;
    map.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col !== '0') return;

        trails += findUniqueTrails(map, {row: rowIdx, col: colIdx});
      });
    });

    return trails;
  }
};
