import { solve } from '../src/solutions/day14';

const testInput = `
11
7
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3
`;

describe('Day 14', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(12);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe(0);
  });
});
