import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Plot {
  type: string;
  row: number;
  col: number;
  perimeterEdges?: number;
}

interface Region {
  plots: Plot[];
  sides?: number;
}

/* helper function to map out a whole region. just a breadth-first search
 * looking for the same character. at the same time also keeping track of 
 * each plot's edges that are on the region boundary to make the perimeter
 * calculation later easier
 */
const findRegion = (map: string[][], plot: Plot): Region => {
  const visited: string[] = [];
  const queue: Plot[] = [];
  const plots: Plot[] = [];

  visited.push(`${plot.row},${plot.col}`);
  queue.push(plot);

  while (queue.length) {
    const curr = queue.shift() as Plot;
    let perimeterEdges = 0;

    // up
    if (
      curr.row - 1 >= 0 &&
      map[curr.row - 1][curr.col] === plot.type
    ) {
      if (!visited.includes(`${curr.row - 1},${curr.col}`)) {
        visited.push(`${curr.row - 1},${curr.col}`);
        queue.push({type: plot.type, row: curr.row - 1, col: curr.col});
      }
    } else {
      perimeterEdges++;
    }

    // down
    if (
      curr.row + 1 < map.length &&
      map[curr.row + 1][curr.col] === plot.type
    ) {
      if (!visited.includes(`${curr.row + 1},${curr.col}`)) {
        visited.push(`${curr.row + 1},${curr.col}`);
        queue.push({type: plot.type, row: curr.row + 1, col: curr.col});
      }
    } else {
      perimeterEdges++;
    }

    // left
    if (
      curr.col >= 0 &&
      map[curr.row][curr.col - 1] === plot.type
    ) {
      if (!visited.includes(`${curr.row},${curr.col - 1}`)) {
        visited.push(`${curr.row},${curr.col - 1}`);
        queue.push({type: plot.type, row: curr.row, col: curr.col - 1});
      }
    } else {
      perimeterEdges++;
    }

    // right
    if (
      curr.col < map[0].length &&
      map[curr.row][curr.col + 1] === plot.type
    ) {
      if (!visited.includes(`${curr.row},${curr.col + 1}`)) {
        visited.push(`${curr.row},${curr.col + 1}`);
        queue.push({type: plot.type, row: curr.row, col: curr.col + 1});
      }
    } else {
      perimeterEdges++;
    }

    plots.push({type: plot.type, row: curr.row, col: curr.col, perimeterEdges});
  }

  return {plots};
};

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => line.split(''));

    const visitedPlots: string[] = [];
    const regions: Region[] = [];
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        // keeping track of all plots already added to regions so we don't repeat
        if (visitedPlots.includes(`${rowIdx},${colIdx}`)) return;

        const region = findRegion(grid, {type: col, row: rowIdx, col: colIdx});

        regions.push(region);
        region.plots.forEach(plot => visitedPlots.push(`${plot.row},${plot.col}`));
      });
    });

    // since findRegion() also got the outer edges of every plot, we can just
    // add up those values to get the region's perimeter
    return regions.reduce((acc, region) => {
      const area = region.plots.length;
      const perimeter = region.plots.reduce((acc, plot) => acc + (plot.perimeterEdges ?? 0), 0);
      return acc + (area * perimeter);
    }, 0);
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const grid = lines.map(line => line.split(''));

    const visitedPlots: string[] = [];
    const regions: Region[] = [];
    grid.forEach((row, rowIdx) => {
      row.forEach((col, colIdx) => {
        if (col === '.') return;
        if (visitedPlots.includes(`${rowIdx},${colIdx}`)) return;

        const region = findRegion(grid, {type: col, row: rowIdx, col: colIdx});

        /* this is... more verbose than i feel like it needed to be. but it's
         * simple and it works :)
         * i'm looping through each plot in a region, and checking if any side
         * of it is on the region's edge. if so, we crawl that edge to find the
         * where that edge starts and ends, adding it to a set so we don't
         * repeat any edges.
         */
        const edges = new Set<string>();
        region.plots.forEach(plot => {
          /* i'll comment the upper edge, since the lower, left, and right edges
           * all just use the same logic with adjusted directions.
           * we know we have an upper edge if the row above this plot is either
           * out of bounds or a different character
           */
          if (plot.row - 1 < 0 || grid[plot.row - 1][plot.col] !== plot.type) {
            let colStart = plot.col;
            let colEnd = plot.col;
            // crawl from the plot's position left to find the start of the edge
            for (let i = plot.col; i >= 0; i--) {
              const nextCol = i - 1;
              const rowAbove = plot.row - 1;
              if (
                // we hit the left edge of the grid
                nextCol < 0 ||
                // the next plot is a different type, the edge is broken
                grid[plot.row][nextCol] !== plot.type ||
                // if the row above is in bounds and the plot left and up from
                // this one is the same, we hit a corner and the edge ends
                // e.g. looking for R on the bottom row here starting from the
                // right and moving left, when we reach the third R the edge
                // ends because of the R above to the left
                //
                // R...
                // RRRR
                //
                rowAbove >= 0 &&
                grid[rowAbove][nextCol] === plot.type
              ) {
                colStart = i;
                break;
              }
            }
            // go right to find end. same logic as above, just the other direction
            for (let i = plot.col; i < grid[0].length; i++) {
              const nextCol = i + 1;
              const rowAbove = plot.row - 1;
              if (
                nextCol === grid[0].length ||
                grid[plot.row][nextCol] !== plot.type ||
                rowAbove >= 0 &&
                grid[rowAbove][nextCol] === plot.type
              ) {
                colEnd = i;
                break;
              }
            }
            // add a string representation of this edge to the set
            edges.add(`H${plot.row}-${colStart}:${colEnd}`);
          }

          // lower edge
          if (plot.row + 1 === grid.length || grid[plot.row + 1][plot.col] !== plot.type) {
            let colStart = plot.col;
            let colEnd = plot.col;
            // go left to find start
            for (let i = plot.col; i >= 0; i--) {
              const nextCol = i - 1;
              const rowBelow = plot.row + 1;
              if (
                nextCol < 0 ||
                grid[plot.row][nextCol] !== plot.type ||
                rowBelow < grid.length &&
                grid[rowBelow][nextCol] === plot.type
              ) {
                colStart = i;
                break;
              }
            }
            // go right to find end
            for (let i = plot.col; i < grid[0].length; i++) {
              const nextCol = i + 1;
              const rowBelow = plot.row + 1;
              if (
                nextCol === grid[0].length ||
                grid[plot.row][nextCol] !== plot.type ||
                rowBelow < grid.length &&
                grid[rowBelow][nextCol] === plot.type
              ) {
                colEnd = i;
                break;
              }
            }
            edges.add(`H${plot.row + 1}-${colStart}:${colEnd}`);
          }

          // left edge
          if (plot.col - 1 < 0 || grid[plot.row][plot.col - 1] !== plot.type) {
            let rowStart = plot.row;
            let rowEnd = plot.row;
            // go up to find start
            for (let i = plot.row; i >= 0; i--) {
              const nextRow = i - 1;
              const colLeft = plot.col - 1;
              if (
                nextRow < 0 ||
                grid[nextRow][plot.col] !== plot.type ||
                colLeft >= 0 &&
                grid[nextRow][colLeft] === plot.type
              ) {
                rowStart = i;
                break;
              }
            }
            // go down to find end
            for (let i = plot.row; i < grid.length; i++) {
              const nextRow = i + 1;
              const colLeft = plot.col - 1;
              if (
                nextRow === grid.length ||
                grid[nextRow][plot.col] !== plot.type ||
                colLeft >= 0 &&
                grid[nextRow][colLeft] === plot.type
              ) {
                rowEnd = i;
                break;
              }
            }
            edges.add(`V${plot.col}-${rowStart}:${rowEnd}`);
          }

          // right edge
          if (plot.col + 1 === grid[0].length || grid[plot.row][plot.col + 1] !== plot.type) {
            let rowStart = plot.row;
            let rowEnd = plot.row;
            // go up to find start
            for (let i = plot.row; i >= 0; i--) {
              const nextRow = i - 1;
              const colRight = plot.col + 1;
              if (
                nextRow < 0 ||
                grid[nextRow][plot.col] !== plot.type ||
                colRight < grid[0].length &&
                grid[nextRow][colRight] === plot.type
              ) {
                rowStart = i;
                break;
              }
            }
            // go down to find end
            for (let i = plot.row; i < grid.length; i++) {
              const nextRow = i + 1;
              const colRight = plot.col + 1;
              if (
                nextRow === grid.length ||
                grid[nextRow][plot.col] !== plot.type ||
                colRight < grid[0].length &&
                grid[nextRow][colRight] === plot.type
              ) {
                rowEnd = i;
                break;
              }
            }
            edges.add(`V${plot.col + 1}-${rowStart}:${rowEnd}`);
          }
        });

        // after all that we have a set of unique edges for the region
        region.sides = edges.size;
        regions.push(region);
        region.plots.forEach(plot => visitedPlots.push(`${plot.row},${plot.col}`));
      });
    });

    return regions.reduce((acc, region) => {
      const area = region.plots.length;
      return acc + (area * (region.sides ?? 0));
    }, 0);
  }
};
