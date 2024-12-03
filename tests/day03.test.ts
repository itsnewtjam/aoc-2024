import { solve } from '../src/solutions/day03';

describe('Day 3', () => {
  test('Part 1', () => {
    const testInput = `xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))`;
    expect(solve.part1(testInput)).toBe(161);
  });

  test('Part 2', () => {
    const testInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
    expect(solve.part2(testInput)).toBe(48);
  });
});
