import { solve } from '../src/solutions/day17';

const testInput = `
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0
`;

const testInput2 = `
Register A: 2024
Register B: 0
Register C: 0

Program: 0,3,5,4,3,0
`;

describe('Day 17', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe('4,6,3,5,6,3,5,2,1,0');
  });

  test('Part 2', () => {
    expect(solve.part2(testInput2)).toBe(117440);
  });
});
