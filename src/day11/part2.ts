import { parseInput } from '../util';
import { shortestPathOnGrid } from './part1';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * The galaxies are much older (and thus much farther apart) than the researcher initially estimated.
 *
 * Now, instead of the expansion you did before, make each empty row or column one million times larger. That is, each empty row should be replaced with 1000000 empty rows, and each empty column should be replaced with 1000000 empty columns.
 *
 * (In the example above, if each empty row or column were merely 10 times larger, the sum of the shortest paths between every pair of galaxies would be 1030. If each empty row or column were merely 100 times larger, the sum of the shortest paths between every pair of galaxies would be 8410. However, your universe will need to expand far beyond these values.)
 *
 * Starting with the same initial image, expand the universe according to these new rules, then find the length of the shortest path between every pair of galaxies. What is the sum of these lengths?
 */

function part2(input: string[]): number {
  const grid = input.map(line => line.split(''));

  const galaxies: number[][] = [];

  // Record positions of all #
  for (let i = 0; i < grid[0].length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (grid[j][i] === '#') {
        galaxies.push([i, j]);
      }
    }
  }

  // Look for empty rows
  for (let y = grid.length - 1; y >= 0; y--) {
    let allDots = true;
    for (let x = 0; x < grid[0].length; x++) {
      if (grid[y][x] !== '.') {
        allDots = false;
        break;
      }
    }

    if (allDots) {
      // Look for all galaxies with a y value greater than y and add 1000000 to their y value
      for (let g = 0; g < galaxies.length; g++) {
        if (galaxies[g][1] > y) {
          galaxies[g][1] += 1000000 - 1;
        }
      }
    }
  }

  // Look for empty columns
  for (let x = grid[0].length - 1; x >= 0; x--) {
    let allDots = true;
    for (let y = 0; y < grid.length; y++) {
      if (grid[y][x] !== '.') {
        allDots = false;
        break;
      }
    }

    if (allDots) {
      // Look for all galaxies with an x value greater than x and add 1000000 to their x value
      for (const galaxy of galaxies) {
        if (galaxy[0] > x) {
          galaxy[0] += 1000000 - 1;
        }
      }
    }
  }

  let pathSum = 0;

  // For every pair
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      pathSum += shortestPathOnGrid(galaxies[i], galaxies[j]);
    }
  }

  return pathSum;
}

export default part2(input);
