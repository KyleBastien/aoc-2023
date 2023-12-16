import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Day 16: The Floor Will Be Lava ---
 * With the beam of light completely focused somewhere, the reindeer leads you deeper still into the Lava Production Facility. At some point, you realize that the steel facility walls have been replaced with cave, and the doorways are just cave, and the floor is cave, and you're pretty sure this is actually just a giant cave.
 *
 * Finally, as you approach what must be the heart of the mountain, you see a bright light in a cavern up ahead. There, you discover that the beam of light you so carefully focused is emerging from the cavern wall closest to the facility and pouring all of its energy into a contraption on the opposite side.
 *
 * Upon closer inspection, the contraption appears to be a flat, two-dimensional square grid containing empty space (.), mirrors (/ and \), and splitters (| and -).
 *
 * The contraption is aligned so that most of the beam bounces around the grid, but each tile on the grid converts some of the beam's light into heat to melt the rock in the cavern.
 *
 * You note the layout of the contraption (your puzzle input). For example:
 *
 * .|...\....
 * |.-.\.....
 * .....|-...
 * ........|.
 * ..........
 * .........\
 * ..../.\\..
 * .-.-/..|..
 * .|....-|.\
 * ..//.|....
 * The beam enters in the top-left corner from the left and heading to the right. Then, its behavior depends on what it encounters as it moves:
 *
 * If the beam encounters empty space (.), it continues in the same direction.
 * If the beam encounters a mirror (/ or \), the beam is reflected 90 degrees depending on the angle of the mirror. For instance, a rightward-moving beam that encounters a / mirror would continue upward in the mirror's column, while a rightward-moving beam that encounters a \ mirror would continue downward from the mirror's column.
 * If the beam encounters the pointy end of a splitter (| or -), the beam passes through the splitter as if the splitter were empty space. For instance, a rightward-moving beam that encounters a - splitter would continue in the same direction.
 * If the beam encounters the flat side of a splitter (| or -), the beam is split into two beams going in each of the two directions the splitter's pointy ends are pointing. For instance, a rightward-moving beam that encounters a | splitter would split into two beams: one that continues upward from the splitter's column and one that continues downward from the splitter's column.
 * Beams do not interact with other beams; a tile can have many beams passing through it at the same time. A tile is energized if that tile has at least one beam pass through it, reflect in it, or split in it.
 *
 * In the above example, here is how the beam of light bounces around the contraption:
 *
 * >|<<<\....
 * |v-.\^....
 * .v...|->>>
 * .v...v^.|.
 * .v...v^...
 * .v...v^..\
 * .v../2\\..
 * <->-/vv|..
 * .|<<<2-|.\
 * .v//.|.v..
 * Beams are only shown on empty tiles; arrows indicate the direction of the beams. If a tile contains beams moving in multiple directions, the number of distinct directions is shown instead. Here is the same diagram but instead only showing whether a tile is energized (#) or not (.):
 *
 * ######....
 * .#...#....
 * .#...#####
 * .#...##...
 * .#...##...
 * .#...##...
 * .#..####..
 * ########..
 * .#######..
 * .#...#.#..
 * Ultimately, in this example, 46 tiles become energized.
 *
 * The light isn't energizing enough tiles to produce lava; to debug the contraption, you need to start by analyzing the current situation. With the beam starting in the top-left heading right, how many tiles end up being energized?
 */
export type Tile = '/' | '\\' | '|' | '-' | '.'; // Define tile types

interface TileCoordinates {
  i: number;
  j: number;
  di: number;
  dj: number;
}

export function getBeamCoverage(
  grid: Tile[][],
  start: TileCoordinates,
): number {
  const m = grid.length;
  const n = grid[0].length;
  const seen: Set<string> = new Set();
  const q: TileCoordinates[] = [start];

  while (q.length) {
    // eslint-disable-next-line prefer-const
    let { i, j, di, dj } = q.pop()!;
    const ii = i + di;
    const jj = j + dj;

    const key = `${ii},${jj},${di},${dj}`;
    if (seen.has(key)) continue;
    if (!(0 <= ii && ii < m && 0 <= jj && jj < n)) continue;

    seen.add(key);

    const tile = grid[ii][jj];
    switch (tile) {
      case '/':
        [di, dj] = [-dj, -di];
        break;
      case '\\':
        [di, dj] = [dj, di];
        break;
      case '|':
        if (dj) {
          di = 1;
          dj = 0;
          q.push({ i: ii, j: jj, di: -1, dj: 0 });
        }
        break;
      case '-':
        if (di) {
          di = 0;
          dj = 1;
          q.push({ i: ii, j: jj, di: 0, dj: -1 });
        }
        break;
    }

    q.push({ i: ii, j: jj, di: di, dj: dj });
  }

  const energized = new Set<string>();
  for (const x of seen) {
    const [i, j] = x.split(',').slice(0, 2);
    energized.add(`${i},${j}`);
  }

  // Take each energized coordinate and visualize back into the grid and print it out
  // for (let i = 0; i < m; i++) {
  //   let row = '';
  //   for (let j = 0; j < n; j++) {
  //     const key = `${i},${j}`;
  //     if (energized.has(key)) row += '#';
  //     else row += '.';
  //   }
  //   console.log(row);
  // }

  return energized.size;
}

function part1(input: string[]): number {
  const grid: Tile[][] = input.map(row => row.split('') as Tile[]);

  const start: TileCoordinates = { i: 0, j: -1, di: 0, dj: 1 };
  const p1 = getBeamCoverage(grid, start);
  return p1;
}

export default part1(input);
