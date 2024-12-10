import { solve } from '../src/solutions/day10';

const testInput = `
89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732
`;

describe('Day 10', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(36);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(81);
  });
});
