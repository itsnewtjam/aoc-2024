import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Coordinate {
  X: number;
  Y: number;
}

interface Machine {
  buttonA: Coordinate;
  buttonB: Coordinate;
  prize: Coordinate;
}

/* this was actually pretty fun, really helpful that i just finished my
 * discrete math class :)
 */
export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const machines: Machine[] = [];
    for (let i = 0; i < lines.length; i += 4) {
      const [_, ax, ay] = lines[i].match(/X\+(\d+), Y\+(\d+)/)?.map(Number) ?? [0, 0];
      const [__, bx, by] = lines[i + 1].match(/X\+(\d+), Y\+(\d+)/)?.map(Number) ?? [0, 0];
      const [___, px, py] = lines[i + 2].match(/X=(\d+), Y=(\d+)/)?.map(Number) ?? [0, 0];
      machines.push({
        buttonA: {X: ax, Y: ay},
        buttonB: {X: bx, Y: by},
        prize: {X: px, Y: py},
      });
    }

    const winnings: {machine: Machine, A: number, B: number}[] = [];
    machines.forEach(machine => {
      /* just a good ol system of equations problem, solving by substitution
       * got messy, so i went the matrix route. we start with the coefficient
       * and value matrices
       */
      const coeffMatrix = [
        [machine.buttonA.X, machine.buttonB.X],
        [machine.buttonA.Y, machine.buttonB.Y],
      ];
      const eqMatrix = [
        machine.prize.X,
        machine.prize.Y,
      ];

      /* get the determinant of the coefficient matrix, also lets us bail
       * early if there is no solution
       */
      const determinant = coeffMatrix[0][0] * coeffMatrix[1][1] - coeffMatrix[0][1] * coeffMatrix[1][0];
      if (determinant === 0) return;

      // calculate the inverse of the coefficient matrix
      const invCoeff = [
        [coeffMatrix[1][1] / determinant, -coeffMatrix[0][1] / determinant],
        [-coeffMatrix[1][0] / determinant, coeffMatrix[0][0] / determinant],
      ];

      /* multiply the inverse of the coefficient matrix by the
       * value matrix to get the solutions
       */
      const resultMatrix = [
        invCoeff[0][0] * eqMatrix[0] + invCoeff[0][1] * eqMatrix[1],
        invCoeff[1][0] * eqMatrix[0] + invCoeff[1][1] * eqMatrix[1],
      ];

      /* i round the values to avoid any floating point stragglers, but
       * then revalidate the rounded solutions to make sure it was actually
       * a floating point straggler
       */
      const [a, b] = resultMatrix.map(Math.round);
      const xValid = machine.prize.X === machine.buttonA.X * a + machine.buttonB.X * b;
      const yValid = machine.prize.Y === machine.buttonA.Y * a + machine.buttonB.Y * b;

      if (!xValid || !yValid || b > 100 || a > 100) return;

      winnings.push({
        machine,
        A: a,
        B: b,
      });
    });

    return winnings.reduce((acc, win) => {
      return acc += 3 * win.A + win.B;
    }, 0);
  },

  /* same as part1, just with the increse to the prize x and y values.
   * no logic changes outside of allowing more than 100 presses :)
   */
  part2: (input: string) => {
    const lines = parseLines(input);

    const machines: Machine[] = [];
    for (let i = 0; i < lines.length; i += 4) {
      const [_, ax, ay] = lines[i].match(/X\+(\d+), Y\+(\d+)/)?.map(Number) ?? [0, 0];
      const [__, bx, by] = lines[i + 1].match(/X\+(\d+), Y\+(\d+)/)?.map(Number) ?? [0, 0];
      const [___, px, py] = lines[i + 2].match(/X=(\d+), Y=(\d+)/)?.map(Number) ?? [0, 0];
      machines.push({
        buttonA: {X: ax, Y: ay},
        buttonB: {X: bx, Y: by},
        prize: {X: px + 10000000000000, Y: py + 10000000000000},
      });
    }

    const winnings: {machine: Machine, A: number, B: number}[] = [];
    machines.forEach(machine => {
      const coeffMatrix = [
        [machine.buttonA.X, machine.buttonB.X],
        [machine.buttonA.Y, machine.buttonB.Y],
      ];
      const eqMatrix = [
        machine.prize.X,
        machine.prize.Y,
      ];

      const determinant = coeffMatrix[0][0] * coeffMatrix[1][1] - coeffMatrix[0][1] * coeffMatrix[1][0];

      if (determinant === 0) return;

      const invCoeff = [
        [coeffMatrix[1][1] / determinant, -coeffMatrix[0][1] / determinant],
        [-coeffMatrix[1][0] / determinant, coeffMatrix[0][0] / determinant],
      ];

      const resultMatrix = [
        invCoeff[0][0] * eqMatrix[0] + invCoeff[0][1] * eqMatrix[1],
        invCoeff[1][0] * eqMatrix[0] + invCoeff[1][1] * eqMatrix[1],
      ];

      const [a, b] = resultMatrix.map(Math.round);

      const xValid = machine.prize.X === machine.buttonA.X * a + machine.buttonB.X * b;
      const yValid = machine.prize.Y === machine.buttonA.Y * a + machine.buttonB.Y * b;

      if (!xValid || !yValid) return;

      winnings.push({
        machine,
        A: a,
        B: b,
      });
    });

    return winnings.reduce((acc, win) => {
      return acc += 3 * win.A + win.B;
    }, 0);
  }
};
