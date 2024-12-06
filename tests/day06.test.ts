import { solve } from '../src/solutions/day06';

const testInput = `
....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...
`;

describe('Day 6', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(41);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(6);
  });
});
