import { Solution } from "../util/types";

export const solve: Solution = {
  /* very straightforward for part1, just run through the stones
   * and apply the rules, then count them
   */
  part1: (input: string) => {
    let stones = input.split(' ').map(Number);

    for (let i = 0; i < 25; i++) {
      const newStones: number[] = [];
      stones.forEach(stone => {
        if (stone === 0) {
          newStones.push(1);
          return;
        }

        if (stone.toString().length % 2 === 0) {
          newStones.push(
            Number(stone.toString().slice(0, stone.toString().length / 2)),
            Number(stone.toString().slice(stone.toString().length / 2)),
          );
          return;
        }

        newStones.push(stone * 2024);
      });

      stones = newStones;
    }

    return stones.length;
  },

  /* just copying part1 wouldn't work, the number of stones grows too
   * rapidly and we either exceed the array size or memory. so i realized
   * for the purpose of counting stones, the order doesn't actually matter
   */
  part2: (input: string) => {
    const initStones = input.split(' ').map(Number);

    // so this time i start with a map where the key is the number 
    // on the stone, and the value is the number of stones in the
    // line that have that number
    let stones = new Map<number,number>();
    initStones.forEach(stone => {
      stones.set(stone, (stones.get(stone) ?? 0) + 1);
    });

    // so now we still just run through and apply the rules, but rather than
    // extend the array with the new stones, i update the map of stone
    // number => stone count
    for (let i = 0; i < 75; i++) {
      let newStones = new Map<number,number>();
      stones.forEach((count, stone) => {
        if (stone === 0) {
          newStones.set(1, (newStones.get(1) ?? 0) + count);
          return;
        }

        if (stone.toString().length % 2 === 0) {
          const leftStone = Number(stone.toString().slice(0, stone.toString().length / 2));
          const rightStone = Number(stone.toString().slice(stone.toString().length / 2));
          newStones.set(leftStone, (newStones.get(leftStone) ?? 0) + count);
          newStones.set(rightStone, (newStones.get(rightStone) ?? 0) + count);
          return;
        }

        newStones.set(stone * 2024, (newStones.get(stone * 2024) ?? 0) + count);
      });

      stones = newStones;
    }

    // then we can just sum up all the counts and we're done :)
    return Array.from(stones.values()).reduce((acc, count) => acc += count, 0);
  }
};
