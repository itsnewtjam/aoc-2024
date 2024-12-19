import { solve } from '../src/solutions/day19';

const testInput = `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb
`;

describe('Day 19', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(6);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(16);
  });
});
