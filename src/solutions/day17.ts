import { parseLines } from "../util/input";
import { Solution } from "../util/types";

interface Memory {
  A: bigint;
  B: bigint;
  C: bigint;
  I: number;
  out: bigint[];
}

type Combo = 0|1|2|3|4|5|6;
type Literal = 0|1|2|3;

const decodeCombo = (mem: Memory, operand: Combo) => {
  if (operand < 4) return BigInt(operand);
  switch (operand) {
    case 4:
      return mem.A;
    case 5:
      return mem.B;
    case 6:
      return mem.C;
  }
  return 0n;
}

const adv = (mem: Memory, operand: Combo) => {
  const op = decodeCombo(mem, operand);
  mem.A = mem.A >> op;
}

const bxl = (mem: Memory, operand: Literal) => {
  mem.B = mem.B ^ BigInt(operand);
}

const bst = (mem: Memory, operand: Combo) => {
  const op = decodeCombo(mem, operand);
  mem.B = op % 8n;
}

const jnz = (mem: Memory, operand: Literal) => {
  if (mem.A === 0n) return false;
  mem.I = operand;
  return true;
}

const bxc = (mem: Memory) => {
  mem.B = mem.B ^ mem.C;
}

const out = (mem: Memory, operand: Combo) => {
  const op = decodeCombo(mem, operand);
  mem.out.push(op % 8n);
}

const bdv = (mem: Memory, operand: Combo) => {
  const op = decodeCombo(mem, operand);
  mem.B = mem.A >> op;
}

const cdv = (mem: Memory, operand: Combo) => {
  const op = decodeCombo(mem, operand);
  mem.C = mem.A >> op;
}

const run = (mem: Memory, program: string[]) => {
  let exit = 0;
  let exec = true;
  while (exec) {
    if (mem.I >= program.length - 1) break;
    const inst = program[mem.I];
    let inc = true;
    
    switch (inst) {
      case '0':
        adv(mem, Number(program[mem.I + 1]) as Combo);
        break;
      case '1':
        bxl(mem, Number(program[mem.I + 1]) as Literal);
        break;
      case '2':
        bst(mem, Number(program[mem.I + 1]) as Combo);
        break;
      case '3':
        const jumped = jnz(mem, Number(program[mem.I + 1]) as Literal);
        inc = !jumped;
        break;
      case '4':
        bxc(mem);
        break;
      case '5':
        out(mem, Number(program[mem.I + 1]) as Combo);
        break;
      case '6':
        bdv(mem, Number(program[mem.I + 1]) as Combo);
        break;
      case '7':
        cdv(mem, Number(program[mem.I + 1]) as Combo);
        break;
      default:
        console.log('Invalid opcode');
        exit = 1;
        exec = false;
    }
    if (!exec) break;
    if (inc) mem.I += 2;
  }

  if (exit === 0) {
    const output = mem.out.join(',');
    return output;
  }

  return '0';
}

export const solve: Solution = {
  // easy enough, just parse and run the program :)
  part1: (input: string) => {
    const lines = parseLines(input);

    const mem: Memory = {A: 0n, B: 0n, C: 0n, I: 0, out: []};

    while (true) {
      const line = lines.shift()!;
      if (line.length === 0) break;
      const [_, register, value] = line.match(/Register ([A-C]): (\d+)/) as RegExpMatchArray;
      if (!['A', 'B', 'C'].includes(register)) continue;
      mem[register as 'A'|'B'|'C'] = BigInt(value);
    }
    const program = lines.shift()!.split(' ')[1].split(',');

    const output = run(mem, program);
    return output;
  },

  /* i'm pretty sure i had this 98% solved numerous times before scrapping
   * and restarting thinking i was on the wrong track. anyways, bitwise!
   */
  part2: (input: string) => {
    const lines = parseLines(input);

    let mem: Memory = {A: 0n, B: 0n, C: 0n, I: 0, out: []};

    while (true) {
      const line = lines.shift()!;
      if (line.length === 0) break;
      const [_, register, value] = line.match(/Register ([A-C]): (\d+)/) as RegExpMatchArray;
      if (!['A', 'B', 'C'].includes(register)) continue;
      mem[register as 'A'|'B'|'C'] = BigInt(value);
    }
    const program = lines.shift()!.split(' ')[1].split(',');

    /* so... the program is just right shifting by 3 and outputting the 
     * last 3 bits. so we just reverse that, left shift by 3 and find which
     * 3 bits will give the target output value. then repeat :)
     */
    const outputs = [...program].reverse().map(BigInt);
    let values = [0n];
    outputs.forEach(out => {
      const prevValues: bigint[] = [];
      values.forEach(value => {
        const temp = value << 3n;
        for (let i = (temp + 0n); i < (temp + 8n); i++) {
          const result = run({A: i, B: 0n, C: 0n, I: 0, out: []}, program);
          if (BigInt(result.split(',')[0]) === out) {
            prevValues.push(i);
          }
        }

        values = [...prevValues];
      });
    });

    return values[0].toString();
  }
};
