import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Equation {
  value: number;
  terms: number[];
}

type Operator = '+'|'*'|'||';

/* helper function to incrementally get combinations
 * for inputs (
 *   combos = ['abc', 'def']
 *   items = ['x', 'y']
 * ), would return ['abcx', 'abcy', 'defx', 'defy']
 */
const getCombinations = (combos: string[][], items: string[]) => {
  let newCombos: string[][] = [];
  combos.forEach(combo => {
    items.forEach(item => {
      newCombos.push([...combo, item]);
    });
  });

  return newCombos;
};

/* helper function to see if any arrangement of the given
 * operators can make the given equation true
 */
const tryOperators = (operators: Operator[], equation: Equation) => {
  // incrementally build combinations to the needed
  // length for the equation
  let combos: string[][] = operators.map(_ => []);
  for (let i = 0; i < equation.terms.length - 1; i++) {
    combos = getCombinations(combos, operators);
  }

  // try computing every operator combination
  for (let i = 0; i < combos.length; i++) {
    const curr = combos[i];
    let runningTotal = equation.terms[0];
    for (let j = 1; j < equation.terms.length; j++) {
      switch (curr[j - 1]) {
        case '+':
          runningTotal = runningTotal + equation.terms[j];
          break;
        case '*':
          runningTotal = runningTotal * equation.terms[j];
          break;
        case '||':
          runningTotal = Number(`${runningTotal}${equation.terms[j]}`);
          break;
      }
    }

    // it worked!
    if (runningTotal === equation.value) {
      return true;
    }
  }

  return false;
};

export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    const equations: Equation[] = lines.map(line => {
      const [value, terms] = line.split(': ');
      return {
        value: Number(value),
        terms: terms.split(' ').map(Number),
      };
    });

    let possiblyTruesTotal = 0;
    equations.forEach(eqn => {
      if (tryOperators(['+','*'], eqn)) {
        possiblyTruesTotal += eqn.value;
      }
    });

    return possiblyTruesTotal;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const equations: Equation[] = lines.map(line => {
      const [value, terms] = line.split(': ');
      return {
        value: Number(value),
        terms: terms.split(' ').map(Number),
      };
    });

    let possiblyTruesTotal = 0;
    equations.forEach(eqn => {
      if (tryOperators(['+','*','||'], eqn)) {
        possiblyTruesTotal += eqn.value;
      }
    });

    return possiblyTruesTotal;
  }
};
