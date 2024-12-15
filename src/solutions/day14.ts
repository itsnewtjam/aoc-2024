import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Robot {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);
    const GRID_WIDTH = Number(lines.shift());
    const GRID_HEIGHT = Number(lines.shift());

    const robots: Robot[] = lines.map(line => {
      const [_, x, y, dx, dy] = line.match(/p=([-0-9]+),([-0-9]+) v=([-0-9]+),([-0-9]+)/) as RegExpMatchArray;

      return {
        x: Number(x),
        y: Number(y),
        dx: Number(dx),
        dy: Number(dy),
      };
    });

    for (let i = 0; i < 100; i++) {
      robots.forEach(robot => {
        let newX = robot.x + robot.dx;
        let newY = robot.y + robot.dy;

        // just checks to wrap around the edges of the map
        if (newX >= GRID_WIDTH) newX -= GRID_WIDTH;
        if (newX < 0) newX = GRID_WIDTH + newX;
        if (newY >= GRID_HEIGHT) newY -= GRID_HEIGHT;
        if (newY < 0) newY = GRID_HEIGHT + newY;

        robot.x = newX;
        robot.y = newY;
      });
    }

    let quad1 = 0;
    let quad2 = 0;
    let quad3 = 0;
    let quad4 = 0;
    const centerX = Math.floor(GRID_WIDTH / 2);
    const centerY = Math.floor(GRID_HEIGHT / 2);

    // counting up robots by which quadrant they're in
    //  2 | 1
    // ---+---
    //  3 | 4
    robots.forEach(robot => {
      if (robot.x === centerX || robot.y === centerY) return;

      if (robot.x > centerX) {
        if (robot.y > centerY) {
          quad4++;
        } else {
          quad1++;
        }
      } else {
        if (robot.y > centerY) {
          quad3++;
        } else {
          quad2++;
        }
      }
    });

    return quad1 * quad2 * quad3 * quad4;
  },

  // so i'm sure there's a fancier way to do this, but I
  // just kind of brute forced it
  part2: (input: string) => {
    const lines = parseLines(input);
    const GRID_WIDTH = Number(lines.shift());
    const GRID_HEIGHT = Number(lines.shift());

    // fill out a representation of the grid, where the value at
    // each cell is the number of robots there
    const grid = new Array<number[]>(GRID_HEIGHT);
    for (let i = 0; i < GRID_HEIGHT; i++) {
      grid[i] = (new Array<number>(GRID_WIDTH)).fill(0);
    }

    const robots: Robot[] = lines.map(line => {
      const [_, x, y, dx, dy] = line.match(/p=([-0-9]+),([-0-9]+) v=([-0-9]+),([-0-9]+)/) as RegExpMatchArray;

      return {
        x: Number(x),
        y: Number(y),
        dx: Number(dx),
        dy: Number(dy),
      };
    });

    // add all the robots to the grid
    robots.forEach(robot => grid[robot.y][robot.x] += 1);

    /* i worked on the assumption that when the picture gets drawn,
     * there wouldn't be any cells with more than one robot. my thought
     * was that every robot would be involved in the picture.
     * so, we just continuously tick through their movements, checking if
     * there are any cells with more than one. if not, then the grid gets
     * printed with the seconds so that i can check if the picture is there
     */
    let seconds = 0;
    while (true) {
      robots.forEach(robot => {
        grid[robot.y][robot.x] -= 1;
        let newX = robot.x + robot.dx;
        let newY = robot.y + robot.dy;

        if (newX >= GRID_WIDTH) newX -= GRID_WIDTH;
        if (newX < 0) newX = GRID_WIDTH + newX;
        if (newY >= GRID_HEIGHT) newY -= GRID_HEIGHT;
        if (newY < 0) newY = GRID_HEIGHT + newY;

        grid[newY][newX] += 1;
        robot.x = newX;
        robot.y = newY;
      });

      seconds++;

      let anyStacks = false;
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
          if (grid[r][c] > 1) {
            anyStacks = true;
            break;
          }
        }
        if (anyStacks) break;
      }
      // 6911 was a false positive, no stacks but no picture :)
      if (!anyStacks && ![6911].includes(seconds)) {
        grid.forEach(row => console.log(row.join('').replace(/0/g, '.')));
        console.log(`seconds: ${seconds}`);
        break;
      }
    }

    return 0;
  }
};
