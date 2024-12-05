import { parseLines } from "../util/input";
import { Solution } from "../util/types";

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const ruleLines = lines.slice(0, lines.indexOf(''));
    const updateLines = lines.slice(ruleLines.length + 1);

    const rules = ruleLines.map(rule => {
      const [X, Y] = rule.split('|');
      return { X, Y };
    });

    const updates = updateLines.map(update => {
      return update.split(',');
    });

    const validUpdates: string[][] = [];
    updates.forEach(update => {
      const relevantRules = rules.filter(rule => update.includes(rule.X) && update.includes(rule.Y));

      let valid = true;
      for (let i = 0; i < relevantRules.length; i++) {
        const rule = relevantRules[i];
        if (update.indexOf(rule.X) > update.indexOf(rule.Y)) {
          valid = false;
          break;
        }
      }

      if (valid) {
        validUpdates.push(update);
      }
    });

    let total = 0;
    validUpdates.forEach(update => {
      total += Number(update[Math.floor(update.length / 2)])
    });

    return total;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const ruleLines = lines.slice(0, lines.indexOf(''));
    const updateLines = lines.slice(ruleLines.length + 1);

    const rules = ruleLines.map(rule => {
      const [X, Y] = rule.split('|');
      return { X, Y };
    });

    const updates = updateLines.map(update => {
      return update.split(',');
    });

    const invalidUpdates: string[][] = [];
    updates.forEach(update => {
      const relevantRules = rules.filter(rule => update.includes(rule.X) && update.includes(rule.Y));

      let valid = true;
      for (let i = 0; i < relevantRules.length; i++) {
        const rule = relevantRules[i];
        if (update.indexOf(rule.X) > update.indexOf(rule.Y)) {
          valid = false;
          break;
        }
      }

      if (!valid) {
        invalidUpdates.push(update);
      }
    });

    invalidUpdates.forEach(update => {
      const relevantRules = rules.filter(rule => update.includes(rule.X) && update.includes(rule.Y));

      update.sort((x, y) => {
        const ruleXY = relevantRules.find(rule => rule.X === x && rule.Y === y);
        const ruleYX = relevantRules.find(rule => rule.X === y && rule.Y === x);

        if (ruleXY) return -1; 
        if (ruleYX) return 1;
        return 0;
      });
    });

    let total = 0;
    invalidUpdates.forEach(update => {
      total += Number(update[Math.floor(update.length / 2)])
    });

    return total;
  }
};
