import { parseLines } from "../util/input";
import { Solution } from "../util/types";

export const solve: Solution = {
  /* this one is pretty straightforward:
   * - split the lines by the whitespace
   * - sort the sides
   * - get the difference (absolute value so we don't have to 
   *   worry about which is bigger)
   * - add up the differences
   */
  part1: (input: string) => {
    const lines = parseLines(input)

    const leftList: number[] = [];
    const rightList: number[] = [];

    lines.forEach(line => {
      const [left, right] = line.split('   ');
      leftList.push(Number(left));
      rightList.push(Number(right));
    });

    leftList.sort();
    rightList.sort();

    const diffs = leftList.map((item, i) => {
      return Math.abs(item - rightList[i]);
    });

    return diffs.reduce((acc, diff) => {
      return acc + diff;
    }, 0);
  },

  /* also pretty straightforward
   * - split the lines by whitespace
   * - for each left number n, total += n * f, where f is the  
   *   number of times n appears in the right list
   */
  part2: (input: string) => {
    const lines = parseLines(input);

    const leftList: number[] = [];
    const rightList: number[] = [];

    lines.forEach(line => {
      const [left, right] = line.split('   ');
      leftList.push(Number(left));
      rightList.push(Number(right));
    });

    const similiarityScore = leftList.reduce((acc, item) => {
      const freq = rightList.filter(ritem => ritem === item).length;
      return acc + (freq * item);
    }, 0);

    return similiarityScore;
  }
}
