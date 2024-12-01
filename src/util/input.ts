import { readFileSync } from 'fs';
import path from 'path';

export const readInput = (day: number): string => {
  return readFileSync(path.join(__dirname, `../../inputs/day${String(day).padStart(2, '0')}.txt`), 'utf-8');
};

export const parseLines = (input: string): string[] => {
  return input.trim().split('\n');
};

export const parseNumbers = (input: string): number[] => {
  return parseLines(input).map(Number);
};
