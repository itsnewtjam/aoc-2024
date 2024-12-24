import { solve } from '../src/solutions/day23';

const testInput = `
kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn
`;

describe('Day 23', () => {
  test('Part 1', () => {
    expect(solve.part1(testInput)).toBe(7);
  });

  test('Part 2', () => {
    expect(solve.part2(testInput)).toBe('co,de,ka,ta');
  });
});
