import { parseInput } from '../util';
import { getBeamCoverage, Tile } from './part1';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * As you try to work out what might be wrong, the reindeer tugs on your shirt and leads you to a nearby control panel. There, a collection of buttons lets you align the contraption so that the beam enters from any edge tile and heading away from that edge. (You can choose either of two directions for the beam if it starts on a corner; for instance, if the beam starts in the bottom-right corner, it can start heading either left or upward.)
 *
 * So, the beam could start on any tile in the top row (heading downward), any tile in the bottom row (heading upward), any tile in the leftmost column (heading right), or any tile in the rightmost column (heading left). To produce lava, you need to find the configuration that energizes as many tiles as possible.
 *
 * In the above example, this can be achieved by starting the beam in the fourth tile from the left in the top row:
 *
 * .|<2<\....
 * |v-v\^....
 * .v.v.|->>>
 * .v.v.v^.|.
 * .v.v.v^...
 * .v.v.v^..\
 * .v.v/2\\..
 * <-2-/vv|..
 * .|<<<2-|.\
 * .v//.|.v..
 * Using this configuration, 51 tiles are energized:
 *
 * .#####....
 * .#.#.#....
 * .#.#.#####
 * .#.#.##...
 * .#.#.##...
 * .#.#.##...
 * .#.#####..
 * ########..
 * .#######..
 * .#...#.#..
 * Find the initial beam configuration that energizes the largest number of tiles; how many tiles are energized in that configuration?
 */
function part2(input: string[]): number {
  const grid: Tile[][] = input.map(row => row.split('') as Tile[]);
  let p2 = 0;
  const m = grid.length;
  const n = grid[0].length;

  for (let i = 0; i < m; i++) {
    p2 = Math.max(p2, getBeamCoverage(grid, { i: i, j: -1, di: 0, dj: 1 }));
    p2 = Math.max(p2, getBeamCoverage(grid, { i: i, j: n, di: 0, dj: -1 }));
  }

  for (let j = 0; j < n; j++) {
    p2 = Math.max(p2, getBeamCoverage(grid, { i: -1, j: j, di: 1, dj: 0 }));
    p2 = Math.max(p2, getBeamCoverage(grid, { i: m, j: j, di: -1, dj: 0 }));
  }

  return p2;
}

export default part2(input);
