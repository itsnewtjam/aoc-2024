import { solve } from '../src/solutions/day04';

const testInput = `
MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX
`;

describe('Day 4', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(18);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(9);
  });
});
