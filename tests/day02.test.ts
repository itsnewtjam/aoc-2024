import { solve } from '../src/solutions/day02';

const testInput = `
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
`;

describe('Day 2', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(2);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(4);
  });
});
