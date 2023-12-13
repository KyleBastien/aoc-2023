import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * You resume walking through the valley of mirrors and - SMACK! - run directly into one. Hopefully nobody was watching, because that must have been pretty embarrassing.
 *
 * Upon closer inspection, you discover that every mirror has exactly one smudge: exactly one . or # should be the opposite type.
 *
 * In each pattern, you'll need to locate and fix the smudge that causes a different reflection line to be valid. (The old reflection line won't necessarily continue being valid after the smudge is fixed.)
 *
 * Here's the above example again:
 *
 * #.##..##.
 * ..#.##.#.
 * ##......#
 * ##......#
 * ..#.##.#.
 * ..##..##.
 * #.#.##.#.
 *
 * #...##..#
 * #....#..#
 * ..##..###
 * #####.##.
 * #####.##.
 * ..##..###
 * #....#..#
 * The first pattern's smudge is in the top-left corner. If the top-left # were instead ., it would have a different, horizontal line of reflection:
 *
 * 1 ..##..##. 1
 * 2 ..#.##.#. 2
 * 3v##......#v3
 * 4^##......#^4
 * 5 ..#.##.#. 5
 * 6 ..##..##. 6
 * 7 #.#.##.#. 7
 * With the smudge in the top-left corner repaired, a new horizontal line of reflection between rows 3 and 4 now exists. Row 7 has no corresponding reflected row and can be ignored, but every other row matches exactly: row 1 matches row 6, row 2 matches row 5, and row 3 matches row 4.
 *
 * In the second pattern, the smudge can be fixed by changing the fifth symbol on row 2 from . to #:
 *
 * 1v#...##..#v1
 * 2^#...##..#^2
 * 3 ..##..### 3
 * 4 #####.##. 4
 * 5 #####.##. 5
 * 6 ..##..### 6
 * 7 #....#..# 7
 * Now, the pattern has a different horizontal line of reflection between rows 1 and 2.
 *
 * Summarize your notes as before, but instead use the new different reflection lines. In this example, the first pattern's new horizontal line has 3 rows above it and the second pattern's new horizontal line has 1 row above it, summarizing to the value 400.
 *
 * In each pattern, fix the smudge and find the different line of reflection. What number do you get after summarizing the new reflection line in each pattern in your notes?
 */
function handleInput(lines: string[]): string[][][] {
  const blocks: string[][][] = [];
  let currentBlock: string[][] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      blocks.push([...currentBlock]);
      currentBlock = [];
    } else {
      currentBlock.push([...line.trim()]);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push([...currentBlock]);
  }

  return blocks;
}

function findOneDifferenceIndices(
  matrixA: string[][],
  matrixB: string[][],
): [number | null, number | null] {
  let foundI: number | null = null;
  let foundJ: number | null = null;

  for (let i = 0; i < matrixA.length; i++) {
    for (let j = 0; j < matrixA[i].length; j++) {
      if (matrixA[i][j] !== matrixB[i][j]) {
        if (foundI !== null) {
          return [null, null];
        } else {
          foundI = i;
          foundJ = j;
        }
      }
    }
  }

  return [foundI, foundJ];
}

function findHorizontalSymmetry(problem: string[][]): number {
  for (let i = 1; i < problem.length; i++) {
    const rows = Math.min(i, problem.length - i);
    const up = problem.slice(i - rows, i);
    const down = problem.slice(i, i + rows).reverse();
    const [di, dj] = findOneDifferenceIndices(up, down);

    if (di !== null && dj !== null) {
      problem[i + di][dj] = problem[i + di][dj] === '.' ? '#' : '.';
      return i;
    }
  }
  return 0;
}

function solve(problem: string[][]): number {
  const horizontalSymmetry = findHorizontalSymmetry(problem);
  const transposedProblem = problem[0].map((_, colIndex) =>
    problem.map(row => row[colIndex]),
  );
  const verticalSymmetry = findHorizontalSymmetry(transposedProblem);

  return horizontalSymmetry * 100 + verticalSymmetry;
}

function part2(lines: string[]): number {
  const problems = handleInput(lines);
  let totalReflection = 0;

  for (const problem of problems) {
    totalReflection += solve(problem);
  }

  return totalReflection;
}

export default part2(input);
