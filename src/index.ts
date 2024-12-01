import { readInput } from './util/input';

const day = process.argv[2] || 1;
const dayString = String(day).padStart(2, '0');

async function solve() {
  try {
    const { solve } = await import(`./solutions/day${dayString}`);
    const input = readInput(Number(day));

    const part1 = solve.part1(input);
    
    const part2 = solve.part2(input);

    console.log(`\nDay ${day} Solutions:`);
    console.log('Part 1:', part1);
    console.log('Part 2:', part2);
  } catch (e) {
    console.error(`Error solving day ${day}:`, e);
  }
}

solve();
