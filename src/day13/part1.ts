import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Day 13: Point of Incidence ---
 * With your help, the hot springs team locates an appropriate spring which launches you neatly and precisely up to the edge of Lava Island.
 *
 * There's just one problem: you don't see any lava.
 *
 * You do see a lot of ash and igneous rock; there are even what look like gray mountains scattered around. After a while, you make your way to a nearby cluster of mountains only to discover that the valley between them is completely full of large mirrors. Most of the mirrors seem to be aligned in a consistent way; perhaps you should head in that direction?
 *
 * As you move through the valley of mirrors, you find that several of them have fallen from the large metal frames keeping them in place. The mirrors are extremely flat and shiny, and many of the fallen mirrors have lodged into the ash at strange angles. Because the terrain is all one color, it's hard to tell where it's safe to walk or where you're about to run into a mirror.
 *
 * You note down the patterns of ash (.) and rocks (#) that you see as you walk (your puzzle input); perhaps by carefully analyzing these patterns, you can figure out where the mirrors are!
 *
 * For example:
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
 * To find the reflection in each pattern, you need to find a perfect reflection across either a horizontal line between two rows or across a vertical line between two columns.
 *
 * In the first pattern, the reflection is across a vertical line between two columns; arrows on each of the two columns point at the line between the columns:
 *
 * 123456789
 *     ><
 * #.##..##.
 * ..#.##.#.
 * ##......#
 * ##......#
 * ..#.##.#.
 * ..##..##.
 * #.#.##.#.
 *     ><
 * 123456789
 * In this pattern, the line of reflection is the vertical line between columns 5 and 6. Because the vertical line is not perfectly in the middle of the pattern, part of the pattern (column 1) has nowhere to reflect onto and can be ignored; every other column has a reflected column within the pattern and must match exactly: column 2 matches column 9, column 3 matches 8, 4 matches 7, and 5 matches 6.
 *
 * The second pattern reflects across a horizontal line instead:
 *
 * 1 #...##..# 1
 * 2 #....#..# 2
 * 3 ..##..### 3
 * 4v#####.##.v4
 * 5^#####.##.^5
 * 6 ..##..### 6
 * 7 #....#..# 7
 * This pattern reflects across the horizontal line between rows 4 and 5. Row 1 would reflect with a hypothetical row 8, but since that's not in the pattern, row 1 doesn't need to match anything. The remaining rows match: row 2 matches row 7, row 3 matches row 6, and row 4 matches row 5.
 *
 * To summarize your pattern notes, add up the number of columns to the left of each vertical line of reflection; to that, also add 100 multiplied by the number of rows above each horizontal line of reflection. In the above example, the first pattern's vertical line has 5 columns to its left and the second pattern's horizontal line has 4 rows above it, a total of 405.
 *
 * Find the line of reflection in each of the patterns in your notes. What number do you get after summarizing all of your notes?
 */
function handleInput(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let currentBlock: string[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      blocks.push([...currentBlock]);
      currentBlock = [];
    } else {
      currentBlock.push(line.trim());
    }
  }

  if (currentBlock.length > 0) {
    blocks.push([...currentBlock]);
  }

  return blocks;
}

function findHorizontalSymmetry(problem: string[]): number {
  for (let i = 1; i < problem.length; i++) {
    const rows = Math.min(i, problem.length - i);
    const up = problem.slice(i - rows, i);
    const down = problem.slice(i, i + rows).reverse();

    if (arraysEqual(up, down)) {
      return i;
    }
  }
  return 0;
}

function solve(problem: string[]): number {
  const horizontalSymmetry = findHorizontalSymmetry(problem);
  const transposedProblem = transpose(problem);
  const verticalSymmetry = findHorizontalSymmetry(transposedProblem);

  return horizontalSymmetry * 100 + verticalSymmetry;
}

function arraysEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

function transpose(matrix: string[]): string[] {
  return matrix[0]
    .split('')
    .map((_, colIndex) => matrix.map(row => row[colIndex]).join(''));
}

function part1(lines: string[]): number {
  const problems = handleInput(lines);
  let totalReflection = 0;

  for (const problem of problems) {
    const solution = solve(problem);
    totalReflection += solution;
  }

  return totalReflection;
}

export default part1(input);
