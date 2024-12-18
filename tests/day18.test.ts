import { solve } from '../src/solutions/day18';

const testInput = `
6x6x12
5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0
`;

describe('Day 18', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(22);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe('6,1');
  });
});
