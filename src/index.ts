import { formatDay } from './util';

// Command to invoke script looks like:
// yarn start --day=1 --part=2
const day = Number(process.argv[2].replace('--day=', ''));
const part = Number(process.argv[3].replace('--part=', ''));

const outputSolution = (part: number) =>
  console.log(
    `Day ${day} | Part ${part} - Solution: ${
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require(`./day${formatDay(day)}/part${part}.js`).default
    }`,
  );

const validate = (type: 'day' | 'part', num: number, max: number) => {
  if (num < 1 || num > max + 1)
    throw new Error(
      `The ${type} must be number between 1 and ${max}, you entered ${num}`,
    );
};

validate('day', day, 25);
validate('part', part, 2);

outputSolution(part);
