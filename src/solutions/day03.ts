import { Solution } from "../util/types";

export const solve: Solution = {
  part1: (input: string) => {
    const pattern = /mul\((\d+),(\d+)\)/g;

    const instructions = [...input.matchAll(pattern)];

    let total = 0;
    instructions.forEach(inst => {
      const result = Number(inst[1]) * Number(inst[2]);
      total += result;
    });

    return total;
  },

  part2: (input: string) => {
    const pattern = /(?:(mul)\((\d+),(\d+)\))|(?:(do)\(\))|(?:(don't)\(\))/g;

    const instructions = [...input.matchAll(pattern)];

    let total = 0;
    let enabled = true;
    instructions.forEach(inst => {
      if (!inst[1]) {
        enabled = !!inst[4];
      } else if (enabled) {
        const result = Number(inst[2]) * Number(inst[3]);
        total += result;
      }
    });

    return total;
  }
}
