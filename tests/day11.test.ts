import { solve } from '../src/solutions/day11';

const testInput = `125 17`;

describe('Day 11', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(55312);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(0);
  });
});
