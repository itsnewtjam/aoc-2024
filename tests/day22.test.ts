import { solve } from '../src/solutions/day22';

const testInput = `
1
10
100
2024
`;

const testInput2 = `
1
2
3
2024
`;

describe('Day 22', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(37327623);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput2)).toBe(30);
  });
});
