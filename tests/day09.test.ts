import { solve } from '../src/solutions/day09';

const testInput = `2333133121414131402`;

describe('Day 9', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(1928);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(2858);
  });
});
