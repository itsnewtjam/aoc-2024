import { parseLines } from "../util/input";
import { Solution } from "../util/types";

let possibleDesignList: string[] = [];

const decompose = (target: string, options: Map<string,string[]>) => {
  /* subconfigs[i] represents the number of ways to build the
   * substring of target from i to the end
   */
  const subconfigs = new Array(target.length + 1).fill(0);
  // empty string has one way to decompose, empty string :)
  subconfigs[target.length] = 1;
  
  // work backwards from the end of the string
  for (let i = target.length - 1; i >= 0; i--) {
    const first = target[i];
    const possiblePrefixes = options.get(first) ?? [];
    
    // try each possible option that could start at this position
    possiblePrefixes.forEach(option => {
      if (target.slice(i).startsWith(option)) {
        /* if this option works here, we add on the ways to build
         * the remaining string after removing this option.
         * meaning for 'urbrw' if our option is 'ur', we add
         * the different ways 'brw' can be built (which by now has
         * already been calculated :) )
          */
        subconfigs[i] += subconfigs[i + option.length];
      }
    });
  }
  
  return subconfigs[0];
};


export const solve: Solution = {
  part1: (input: string) => {
    const lines = parseLines(input);

    // i'm grouping the options by their first character so we're not
    // needlessly processing extras
    const options = new Map<string,string[]>();
    lines.shift()!.split(', ').forEach(opt => {
      const first = opt[0];
      if (options.has(first)) {
        const opts = options.get(first)!;
        opts.push(opt);
        options.set(first, opts); 
      } else {
        options.set(first, [opt]); 
      }
    });
    lines.shift();
    const designs = lines.map(line => line);

    let possibleDesigns = 0;
    designs.forEach(design => {
      const configs = decompose(design, options);
      if (configs) {
        possibleDesigns++;
        possibleDesignList.push(design);
      }
    });

    return possibleDesigns;
  },

  part2: (input: string) => {
    const lines = parseLines(input);

    const options = new Map<string,string[]>();
    lines.shift()!.split(', ').forEach(opt => {
      const first = opt.slice(0, 1);
      if (options.has(first)) {
        const opts = options.get(first)!;
        opts.push(opt);
        options.set(first, opts); 
      } else {
        options.set(first, [opt]); 
      }
    });
    lines.shift();

    let totalConfigs = 0;
    possibleDesignList.forEach(design => {
      const configs = decompose(design, options);
      totalConfigs += configs;
    });

    return totalConfigs;

  }
};
