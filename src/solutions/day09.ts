import { Solution } from "../util/types";

/* helper function to attempt moving a file
 * searches for first empty space that can fit the file, then swaps
 */
const tryToMoveFile = (blockChunks: number[][], file: number[]) => {
  const newChunks = [...blockChunks];
  for (let i = 0; i < blockChunks.length; i++) {
    const chunk = blockChunks[i];
    if (chunk == file) break;
    if (chunk[0] === -1 && chunk.length >= file.length) {
      newChunks[i] = file;
      newChunks[blockChunks.indexOf(file)] = file.map(() => -1);
      newChunks.splice(i + 1, 0, Array.apply(null, Array(chunk.length - file.length)).map(() => -1));
      break;
    }
  }

  return newChunks;
}

export const solve: Solution = {
  part1: (input: string) => {
    const blocks = input.split('');

    // splitting the input based on [file, empty] pairs
    // also using -1 to represent empty blocks
    let drive: number[] = [];
    blocks.forEach((block, index) => {
      if (index % 2 === 0) {
        // file
        for (let i = 0; i < Number(block); i++) {
          drive.push(index / 2);
        }
      } else {
        // empty
        for (let i = 0; i < Number(block); i++) {
          drive.push(-1);
        }
      }
    });

    // move all blocks to the first available empty space
    let done = false;
    for (let i = drive.length - 1; i > 0; i--) {
      const block = drive[i];
      if (block === -1) continue;

      for (let j = 0; j < drive.length; j++) {
        if (j === i) {
          done = true;
          break;
        }
        if (drive[j] >= 0) continue;
        drive[j] = block;
        break;
      }

      if (done) break;

      drive[i] = -1;
    }

    const checksum = drive.reduce((acc, block, index) => {
      if (block === -1) return acc;

      acc += block * index;
      return acc;
    }, 0);

    return checksum;
  },

  part2: (input: string) => {
    const blocks = input.split('');

    let drive: number[] = [];
    blocks.forEach((block, index) => {
      if (index % 2 === 0) {
        // file
        for (let i = 0; i < Number(block); i++) {
          drive.push(index / 2);
        }
      } else {
        // empty
        for (let i = 0; i < Number(block); i++) {
          drive.push(-1);
        }
      }
    });

    /* this is new from part1. here i'm breaking up the drive into
     * chunks of blocks. meaning for drive 00..111.2, we get the
     * chunks [00, .., 111, ., 2]. this will make it easier to
     * move entire files at once later
     */
    let blockChunks: number[][] = [];
    let nextChunk: number[] = [];
    for (let i = 0; i < drive.length; i++) {
      const block = drive[i];
      const prevBlock = drive[i - 1] ?? -2;

      if (block === prevBlock) {
        nextChunk.push(block);
      } else {
        if (i > 0) blockChunks.push(nextChunk);
        nextChunk = [block];
      }

      if (i === drive.length - 1) {
        blockChunks.push(nextChunk);
      }
    }

    // here we try and move the files up from last to first.
    // see the helper function above
    const files = blockChunks.filter(chunk => chunk[0] >= 0);
    files.reverse().forEach(file => {
      blockChunks = tryToMoveFile(blockChunks, file);
    });

    drive = [];
    blockChunks.forEach(chunk => {
      drive = [...drive, ...chunk];
    });
    const checksum = drive.reduce((acc, block, index) => {
      if (block === -1) return acc;

      acc += block * index;
      return acc;
    }, 0);

    return checksum;

  }
};
