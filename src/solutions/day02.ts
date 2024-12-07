import { parseLines } from "../util/input";
import { Solution } from "../util/types";

type Level = {
  value: number;
  index: number;
  safe: boolean;
};

// helper function to handle the level safety checking
const levelsAreSafe = (levels: number[]) => {
  /* get the starting sign via the difference of the first values.
   * diff / |diff| will give us either 1 or -1, for increasing or
   * decreasing respectively
   */
  const sign = (levels[0] - levels[1]) / Math.abs(levels[0] - levels[1]);
  const result: Level[] = [];
  levels.forEach((level, index) => {
    // send the first level as safe because it's first
    if (index === 0) {
      result.push({
        value: level,
        index,
        safe: true,
      });
      return;
    }

    /* actual safety checks
     * 1. get the difference between the previous value and this value
     * 2. check that diff is at least 1 and at most 3
     */
    const delta = levels[index - 1] - level;
    const safeDelta = Math.abs(delta) >= 1 && Math.abs(delta) <= 3;
    const signMatches = delta / Math.abs(delta) === sign;

    result.push({
      value: level,
      index,
      safe: safeDelta && signMatches,
    });
  });
  
  return {
    result,
    safe: result.every(level => level.safe),
  };
}

export const solve: Solution = {
  // pretty simple, see the helper function for actual detail
  part1: (input: string) => {
    const lines = parseLines(input);

    let safeLines: number[][] = [];
    lines.forEach(line => {
      const levels = line.split(' ').map(Number);

      if (levelsAreSafe(levels).safe) safeLines.push(levels);
    });

    return safeLines.length;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    let safeLines: number[][] = [];
    lines.forEach(line => {
      const levels = line.split(' ').map(Number);

      // check if the line is safe to begin with
      const initLevels = levelsAreSafe(levels);
      if (initLevels.safe) {
        safeLines.push(levels);
        return;
      }

      /* i'm sure there's a fancy smart way to do this where you keep
       * track of bad levels and just check around those, but dead simple
       * also works :)
       *
       * if the line is bad, just go item by item and see if removing
       * that item makes it safe, i.e. are we safe if we remove the first
       * item? What about the second? Third? etc
       */
      for (let i = 0; i < levels.length; i++) {
        const levelsCopy = [...levels];
        levelsCopy.splice(i, 1);

        const removalLevels = levelsAreSafe(levelsCopy);

        if (removalLevels.safe) {
          safeLines.push(levels);
          break;
        }
      }
    });

    return safeLines.length;
  }
}
