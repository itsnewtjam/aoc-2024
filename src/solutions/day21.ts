import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Path {
  [fromto: string]: string;
}

// predefined maps of the preferred path between two keys. keyed as
// [start, end], e.g. 'A0' is start at key A, end at key 0
const NUM_PATHS: Path = {
  'A0': '<',
  'A1': '^<<',
  'A2': '<^',
  'A3': '^',
  'A4': '^^<<',
  'A5': '<^^',
  'A6': '^^',
  'A7': '^^^<<',
  'A8': '<^^^',
  'A9': '^^^',
  '0A': '>',
  '01': '^<',
  '02': '^',
  '03': '^>',
  '04': '^^<',
  '05': '^^',
  '06': '^^>',
  '07': '^^^<',
  '08': '^^^',
  '09': '^^^>',
  '1A': '>>v',
  '10': '>v',
  '12': '>',
  '13': '>>',
  '14': '^',
  '15': '^>',
  '16': '^>>',
  '17': '^^',
  '18': '^^>',
  '19': '^^>>',
  '2A': 'v>',
  '20': 'v',
  '21': '<',
  '23': '>',
  '24': '<^',
  '25': '^',
  '26': '^>',
  '27': '<^^',
  '28': '^^',
  '29': '^^>',
  '3A': 'v',
  '30': '<v',
  '31': '<<',
  '32': '<',
  '34': '<<^',
  '35': '<^',
  '36': '^',
  '37': '<<^^',
  '38': '<^^',
  '39': '^^',
  '4A': '>>vv',
  '40': '>vv',
  '41': 'v',
  '42': 'v>',
  '43': 'v>>',
  '45': '>',
  '46': '>>',
  '47': '^',
  '48': '^>',
  '49': '^>>',
  '5A': 'vv>',
  '50': 'vv',
  '51': '<v',
  '52': 'v',
  '53': 'v>',
  '54': '<',
  '56': '>',
  '57': '<^',
  '58': '^',
  '59': '^>',
  '6A': 'vv',
  '60': '<vv',
  '61': '<<v',
  '62': '<v',
  '63': 'v',
  '64': '<<',
  '65': '<',
  '67': '<<^',
  '68': '<^',
  '69': '^',
  '7A': '>>vvv',
  '70': '>vvv',
  '71': 'vv',
  '72': 'vv>',
  '73': 'vv>>',
  '74': 'v',
  '75': 'v>',
  '76': 'v>>',
  '78': '>',
  '79': '>>',
  '8A': 'vvv>',
  '80': 'vvv',
  '81': '<vv',
  '82': 'vv',
  '83': 'vv>',
  '84': '<v',
  '85': 'v',
  '86': 'v>',
  '87': '<',
  '89': '>',
  '9A': 'vvv',
  '90': '<vvv',
  '91': '<<vv',
  '92': '<vv',
  '93': 'vv',
  '94': '<<v',
  '95': '<v',
  '96': 'v',
  '97': '<<',
  '98': '<',
};

const DIR_PATHS: Path = {
  'A^': '<',
  'A<': 'v<<',
  'Av': 'v<',
  'A>': 'v',
  '^A': '>',
  '^<': 'v<',
  '^v': 'v',
  '^>': '>v',
  '<A': '>>^',
  '<^': '>^',
  '<v': '>',
  '<>': '>>',
  'vA': '>^',
  'v^': '^',
  'v<': '<',
  'v>': '>',
  '>A': '^',
  '>^': '^<',
  '><': '<<',
  '>v': '<',
};

// helper to build a key sequence to the sequence required for the next robot
const buildSequence = (keys: string) => {
  let seq = '';
  let startPoint = 'A';
  keys.split('').forEach(step => {
    if (startPoint === step) {
      seq += 'A'; 
      startPoint = step;
      return;
    }
    seq += DIR_PATHS[`${startPoint}${step}`] + 'A';
    startPoint = step;
  });
  return seq;
}

export const solve: Solution = {
  part1: (input: string) => {
    const codes = parseLines(input);

    let sequencesTotal = 0;
    codes.forEach(code => {
      let startPoint = 'A';
      const subsequences = code.split('').map(key => {
        const seq = NUM_PATHS[`${startPoint}${key}`] + 'A';
        startPoint = key;
        return seq;
      });

      /* this dividing up into sub-sequences thing was an idea to get part 2
       * to work without exceeding memory but i think the sequences still
       * just get too long. i'll probably be back to this, first one i've
       * had to skip :(
       */
      let seqLength = 0;
      subsequences.forEach(subseq => {
        let currentSeq = subseq;
        for (let i = 0; i < 2; i++) {
          currentSeq = buildSequence(currentSeq);
        }
        seqLength += currentSeq.length;
      });

      const codeDigits = Number(code.replace(/[^\d]/, ''));
      sequencesTotal += codeDigits * seqLength;
    });

    return sequencesTotal;
  },
  
  part2: (input: string) => {
    return 0;
  }
};
