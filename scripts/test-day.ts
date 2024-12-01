import { execSync } from "child_process";

const args = process.argv.slice(2);
const watchIndex = args.indexOf('--watch');
const isWatch = watchIndex !== -1;
if (isWatch) {
  args.splice(watchIndex, 1);
}

const day = args[0]?.padStart(2, '0');

if (!day) {
  console.error('Please provide a day number');
  process.exit(1);
}

const command = `jest "day${day}\\.test\\.ts$"${isWatch ? ' --watch' : ''}`;

try {
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  process.exit(1);
}
