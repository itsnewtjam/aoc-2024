import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Price {
  price: number;
  change?: number;
}

const mix = (value: bigint, secret: bigint) => {
  return value ^ secret;
}

const prune = (secret: bigint) => {
  return secret % 16777216n;
}

const nextSecret = (secret: bigint) => {
  secret = mix(secret * 64n, secret);
  secret = prune(secret);
  secret = mix(secret / 32n, secret);
  secret = prune(secret);
  secret = mix(secret * 2048n, secret);
  secret = prune(secret);
  return secret;
}

export const solve: Solution = {
  part1: (input: string) => {
    const buyers = parseLines(input);

    // easy enough, just run 2000 secret iterations and sum them up
    let total = 0n;
    buyers.forEach(buyer => {
      let secret = BigInt(buyer);
      for (let i = 0; i < 2000; i++) {
        secret = nextSecret(secret);
      }
      total += secret;
    });

    return Number(total);
  },

  part2: (input: string) => {
    const buyers = parseLines(input);

    // building a list of prices and the change between that price and the
    // previous price
    let buyerPrices: Price[][] = [];
    buyers.forEach(buyer => {
      let secret = BigInt(buyer);
      let secretStr = secret.toString();
      let initPrice = Number(secretStr[secretStr.length - 1]);
      let prices: Price[] = [{price: initPrice}];
      for (let i = 1; i <= 2000; i++) {
        secret = nextSecret(secret);
        let secretStr = secret.toString();
        let price = Number(secretStr[secretStr.length - 1]);
        let change = price - prices[i - 1].price;
        prices.push({price, change});
      }
      buyerPrices.push(prices);
    });

    // here i'm building up a list of all unique sets of 4 changes
    const changeSets = new Set<string>();
    for (let a = 0; a <= 9; a++) {
      for (let b = 0; b <= 9; b++) {
        for (let c = 0; c <= 9; c++) {
          for (let d = 0; d <= 9; d++) {
            for (let e = 0; e <= 9; e++) {
              const nums = [a, b, c, d, e];
              const diffs = nums.slice(1).map((n, i) => n - nums[i]);
              changeSets.add(diffs.toString());
            }
          }
        }
      }
    }

    // now that we have every possible changeset, i just run through each
    // changeset and check it against the buyers' prices, searching for
    // the largest banana haul :)
    let largest = -Infinity;
    changeSets.forEach(changeSet => {
      const changeArray = changeSet.split(',').map(Number);
      let bananas = 0;
      buyerPrices.forEach(buyer => {
        for (let i = 0; i < buyer.length; i++) {
          if (
            i < buyer.length - 3 &&
            buyer[i].change === changeArray[0] &&
            buyer[i + 1].change === changeArray[1] &&
            buyer[i + 2].change === changeArray[2] &&
            buyer[i + 3].change === changeArray[3]
          ) {
            bananas += buyer[i + 3].price;
            break;
          };
        }
      });

      if (bananas > largest) largest = bananas;
    });

    return largest;
  }
};
