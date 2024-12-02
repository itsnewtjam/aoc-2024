import { parseLines } from "../util/input";
import { Solution } from "../util/types";

type Level = {
  value: number;
  index: number;
  safe: boolean;
};

const levelsAreSafe = (levels: number[]) => {
  const sign = (levels[0] - levels[1]) / Math.abs(levels[0] - levels[1]);
  const result: Level[] = [];
  levels.forEach((level, index) => {
    if (index === 0) {
      result.push({
        value: level,
        index,
        safe: true,
      });
      return;
    }

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

      const initLevels = levelsAreSafe(levels);

      if (initLevels.safe) {
        safeLines.push(levels);
        return;
      }

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
