import { parseInput } from '../util';

const input = parseInput({ split: false });

/**
 * --- Part Two ---
 * Even with your help, the sorting process still isn't fast enough.
 *
 * One of the Elves comes up with a new plan: rather than sort parts individually through all of these workflows, maybe you can figure out in advance which combinations of ratings will be accepted or rejected.
 *
 * Each of the four ratings (x, m, a, s) can have an integer value ranging from a minimum of 1 to a maximum of 4000. Of all possible distinct combinations of ratings, your job is to figure out which ones will be accepted.
 *
 * In the above example, there are 167409079868000 distinct combinations of ratings that will be accepted.
 *
 * Consider only your list of workflows; the list of part ratings that the Elves wanted you to sort is no longer relevant. How many distinct combinations of ratings will be accepted by the Elves' workflows?
 */
function handleInput(input: string): [Map<string, string>, number[][]] {
  const [workflowStr, partsStr] = input.trim().split('\n\n');
  const parts: number[][] = partsStr
    .split('\n')
    .map(line => line.match(/\d+/g)!.map(Number));

  const workflowMap = new Map<string, string>();
  workflowStr.split('\n').forEach(line => {
    const [name, rules] = line.split('{');
    const cleanedRules = rules.slice(0, -1);
    workflowMap.set(name, cleanedRules);
  });

  return [workflowMap, parts];
}

function both(
  ch: string,
  gt: boolean,
  val: number,
  ranges: [number, number][][],
): [number, number][][] {
  const chIndex = 'xmas'.indexOf(ch);
  const ranges2: [number, number][][] = [];

  for (const rng of ranges) {
    const rngCopy = [...rng];
    const [lo, hi] = rng[chIndex];

    const newLo = gt ? Math.max(lo, val + 1) : lo;
    const newHi = gt ? hi : Math.min(hi, val - 1);

    if (newLo > newHi) {
      continue;
    }

    rngCopy[chIndex] = [newLo, newHi];
    ranges2.push([...rngCopy]);
  }

  return ranges2;
}

function acceptanceRangesOuter(
  work: string,
  workflowMap: Map<string, string>,
): [number, number][][] {
  return acceptanceRangesInner(workflowMap.get(work)!.split(','), workflowMap);
}

function acceptanceRangesInner(
  w: string[],
  workflowMap: Map<string, string>,
): [number, number][][] {
  const it = w[0];
  if (it === 'R') {
    return [];
  }
  if (it === 'A') {
    return [
      [
        [1, 4000],
        [1, 4000],
        [1, 4000],
        [1, 4000],
      ],
    ];
  }
  if (!it.includes(':')) {
    return acceptanceRangesOuter(it, workflowMap);
  }

  const cond = it.split(':')[0];
  const gt = cond.includes('>');
  const ch = cond[0];
  const val = parseInt(cond.slice(2));
  const valInverted = gt ? val + 1 : val - 1;

  const ifCondIsTrue = both(
    ch,
    gt,
    val,
    acceptanceRangesInner([it.split(':')[1]], workflowMap),
  );
  const ifCondIsFalse = both(
    ch,
    !gt,
    valInverted,
    acceptanceRangesInner(w.slice(1), workflowMap),
  );

  return [...ifCondIsTrue, ...ifCondIsFalse];
}

function part2(input: string): number {
  const [workflowMap] = handleInput(input);

  let p2 = 0;
  for (const rng of acceptanceRangesOuter('in', workflowMap)) {
    let v = 1;
    for (const [lo, hi] of rng) {
      v *= hi - lo + 1;
    }
    p2 += v;
  }

  return p2;
}

export default part2(input);
