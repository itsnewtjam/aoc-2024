import { solve } from '../src/solutions/day01';

const testInput = '3   4\n4   3\n2   5\n1   3\n3   9\n3   3';

describe('Day 1', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(11);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(31);
  });
});
