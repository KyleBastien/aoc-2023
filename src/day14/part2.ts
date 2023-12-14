import { parseInput } from '../util';
import { Grid, weigh } from './part1';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * The parabolic reflector dish deforms, but not in a way that focuses the beam. To do that, you'll need to move the rocks to the edges of the platform. Fortunately, a button on the side of the control panel labeled "spin cycle" attempts to do just that!
 *
 * Each cycle tilts the platform four times so that the rounded rocks roll north, then west, then south, then east. After each tilt, the rounded rocks roll as far as they can before the platform tilts in the next direction. After one cycle, the platform will have finished rolling the rounded rocks in those four directions in that order.
 *
 * Here's what happens in the example above after each of the first few cycles:
 *
 * After 1 cycle:
 * .....#....
 * ....#...O#
 * ...OO##...
 * .OO#......
 * .....OOO#.
 * .O#...O#.#
 * ....O#....
 * ......OOOO
 * #...O###..
 * #..OO#....
 *
 * After 2 cycles:
 * .....#....
 * ....#...O#
 * .....##...
 * ..O#......
 * .....OOO#.
 * .O#...O#.#
 * ....O#...O
 * .......OOO
 * #..OO###..
 * #.OOO#...O
 *
 * After 3 cycles:
 * .....#....
 * ....#...O#
 * .....##...
 * ..O#......
 * .....OOO#.
 * .O#...O#.#
 * ....O#...O
 * .......OOO
 * #...O###.O
 * #.OOO#...O
 * This process should work if you leave it running long enough, but you're still worried about the north support beams. To make sure they'll survive for a while, you need to calculate the total load on the north support beams after 1000000000 cycles.
 *
 * In the above example, after 1000000000 cycles, the total load on the north support beams is 64.
 *
 * Run the spin cycle for 1000000000 cycles. Afterward, what is the total load on the north support beams?
 */
function rollNorth(grid: Grid): void {
  let dirty = true;
  while (dirty) {
    dirty = false;
    for (let y = 0; y < grid.length - 1; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === '.' && grid[y + 1][x] === 'O') {
          grid[y][x] = 'O';
          grid[y + 1][x] = '.';
          dirty = true;
        }
      }
    }
  }
}

function rollSouth(grid: Grid): void {
  let dirty = true;
  while (dirty) {
    dirty = false;
    for (let y = 1; y < grid.length; y++) {
      for (let x = 0; x < grid[0].length; x++) {
        if (grid[y][x] === '.' && grid[y - 1][x] === 'O') {
          grid[y][x] = 'O';
          grid[y - 1][x] = '.';
          dirty = true;
        }
      }
    }
  }
}

function rollEast(grid: Grid): void {
  let dirty = true;
  while (dirty) {
    dirty = false;
    for (const line of grid) {
      const joinedLine = line.join('');
      if (joinedLine.includes('O.')) {
        line.splice(
          0,
          joinedLine.length,
          ...joinedLine.replace(/O\./g, '.O').split(''),
        );
        dirty = true;
      }
    }
  }
}

function rollWest(grid: Grid): void {
  let dirty = true;
  while (dirty) {
    dirty = false;
    for (const line of grid) {
      const joinedLine = line.join('');
      if (joinedLine.includes('.O')) {
        line.splice(
          0,
          joinedLine.length,
          ...joinedLine.replace(/\.O/g, 'O.').split(''),
        );
        dirty = true;
      }
    }
  }
}

function part2(input: string[]): number {
  const grid: Grid = input.map(row => row.split(''));
  const hashes: string[] = [];
  let target = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const h = grid.map(row => row.join('')).join('');
    const hashed = hashes.indexOf(h);

    if (!target && hashed !== -1) {
      const start = hashed;
      const length = hashes.length - start;
      const minusStart = 1000000000 - start;
      const modulo = minusStart % length;
      target = modulo + start + length;
    }

    if (hashes.length === target && target) {
      break;
    }

    hashes.push(h);
    rollNorth(grid);
    rollWest(grid);
    rollSouth(grid);
    rollEast(grid);
  }

  return weigh(grid);
}

export default part2(input);
