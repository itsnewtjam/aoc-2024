import { solve } from '../src/solutions/day21';

const testInput = `
029A
980A
179A
456A
379A
`;

describe('Day 21', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(126384);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(0);
  });
});
