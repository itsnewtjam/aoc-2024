import { solve } from '../src/solutions/day12';

const testInput = `
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE
`;

describe('Day 12', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(1930);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(1206);
  });
});
