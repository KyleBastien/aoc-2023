import { Point, Points, TupleSet } from '../day21/part1';
import { parseInput } from '../util';

const input = parseInput({ split: false });

/**
 * --- Day 23: A Long Walk ---
 * The Elves resume water filtering operations! Clean water starts flowing over the edge of Island Island.
 *
 * They offer to help you go over the edge of Island Island, too! Just hold on tight to one end of this impossibly long rope and they'll lower you down a safe distance from the massive waterfall you just created.
 *
 * As you finally reach Snow Island, you see that the water isn't really reaching the ground: it's being absorbed by the air itself. It looks like you'll finally have a little downtime while the moisture builds up to snow-producing levels. Snow Island is pretty scenic, even without any snow; why not take a walk?
 *
 * There's a map of nearby hiking trails (your puzzle input) that indicates paths (.), forest (#), and steep slopes (^, >, v, and <).
 *
 * For example:
 *
 * #.#####################
 * #.......#########...###
 * #######.#########.#.###
 * ###.....#.>.>.###.#.###
 * ###v#####.#v#.###.#.###
 * ###.>...#.#.#.....#...#
 * ###v###.#.#.#########.#
 * ###...#.#.#.......#...#
 * #####.#.#.#######.#.###
 * #.....#.#.#.......#...#
 * #.#####.#.#.#########v#
 * #.#...#...#...###...>.#
 * #.#.#v#######v###.###v#
 * #...#.>.#...>.>.#.###.#
 * #####v#.#.###v#.#.###.#
 * #.....#...#...#.#.#...#
 * #.#########.###.#.#.###
 * #...###...#...#...#.###
 * ###.###.#.###v#####v###
 * #...#...#.#.>.>.#.>.###
 * #.###.###.#.###.#.#v###
 * #.....###...###...#...#
 * #####################.#
 * You're currently on the single path tile in the top row; your goal is to reach the single path tile in the bottom row. Because of all the mist from the waterfall, the slopes are probably quite icy; if you step onto a slope tile, your next step must be downhill (in the direction the arrow is pointing). To make sure you have the most scenic hike possible, never step onto the same tile twice. What is the longest hike you can take?
 *
 * In the example above, the longest hike you can take is marked with O, and your starting position is marked S:
 *
 * #S#####################
 * #OOOOOOO#########...###
 * #######O#########.#.###
 * ###OOOOO#OOO>.###.#.###
 * ###O#####O#O#.###.#.###
 * ###OOOOO#O#O#.....#...#
 * ###v###O#O#O#########.#
 * ###...#O#O#OOOOOOO#...#
 * #####.#O#O#######O#.###
 * #.....#O#O#OOOOOOO#...#
 * #.#####O#O#O#########v#
 * #.#...#OOO#OOO###OOOOO#
 * #.#.#v#######O###O###O#
 * #...#.>.#...>OOO#O###O#
 * #####v#.#.###v#O#O###O#
 * #.....#...#...#O#O#OOO#
 * #.#########.###O#O#O###
 * #...###...#...#OOO#O###
 * ###.###.#.###v#####O###
 * #...#...#.#.>.>.#.>O###
 * #.###.###.#.###.#.#O###
 * #.....###...###...#OOO#
 * #####################O#
 * This hike contains 94 steps. (The other possible hikes you could have taken were 90, 86, 82, 82, and 74 steps long.)
 *
 * Find the longest hike you can take through the hiking trails listed on your map. How many steps long is the longest hike?
 */
const slopes = ['^', '>', 'v', '<'] as const;
type Slope = (typeof slopes)[number];
type Tile = '.' | '#' | Slope;
type Grid = Tile[][];
type Input = [grid: Grid, start: Point, end: Point];

export function handleInput(text: string) {
  const grid = text.split('\n').map(line => line.split('')) as Grid;

  const start: Point = [0, grid[0].findIndex(tile => tile === '.')];

  const end: Point = [
    grid.length - 1,
    grid[grid.length - 1].findIndex(tile => tile === '.'),
  ];

  return [grid, start, end] as Input;
}

const deltas: Point[] = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

function getPoints([grid, start, end]: Input) {
  const points = new Points([start, end]);

  for (const [r, row] of grid.entries()) {
    for (const [c, tile] of row.entries()) {
      if (tile === '#') continue;

      let neighbors = 0;

      for (const [nr, nc] of deltas.map(([rd, cd]) => [r + rd, c + cd])) {
        if (nr < 0 || nr >= grid.length || nc < 0 || nr >= grid[0].length)
          continue;

        const newTile = grid.at(nr)?.at(nc);

        if (!newTile || newTile === '#') continue;

        neighbors += 1;
      }

      if (neighbors >= 3) points.add([r, c]);
    }
  }

  return points;
}

type StackPoint = [steps: number, row: number, col: number];
const directions: Record<Slope | '.', Point[]> = {
  '^': [[-1, 0]],
  v: [[1, 0]],
  '<': [[0, -1]],
  '>': [[0, 1]],
  '.': [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ],
};

function getGraph([grid, start, end]: Input, withSlopes: boolean) {
  const points = getPoints([grid, start, end]);

  const graph = Object.fromEntries(
    [...points].map(point => [
      JSON.stringify(point),
      {} as Record<string, number>,
    ]),
  );

  for (const [sr, sc] of points) {
    const stack: StackPoint[] = [[0, sr, sc]];
    const seen = new TupleSet<Point>([[sr, sc]]);

    while (stack.length) {
      const [n, r, c] = stack.shift()!;

      if (n && points.has([r, c])) {
        graph[JSON.stringify([sr, sc])][JSON.stringify([r, c])] = n;
        continue;
      }

      const tile = grid[r][c];

      if (tile === '#') continue;

      for (const [dr, dc] of withSlopes ? directions[tile] : deltas) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr >= grid.length || nc < 0 || nr >= grid[0].length)
          continue;

        const newTile = grid.at(nr)?.at(nc);

        if (!newTile || newTile === '#') continue;

        if (seen.has([nr, nc])) continue;

        stack.push([n + 1, nr, nc]);
        seen.add([nr, nc]);
      }
    }
  }

  return graph;
}

function equals<TValue>(a: TValue[], b: TValue[]) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

export function getLongestPath(
  [grid, start, end]: Input,
  withSlopes: boolean,
): number {
  const graph = getGraph([grid, start, end], withSlopes);

  const seen = new Points();

  const dfs = (point: Point): number => {
    if (equals(point, end)) return 0;

    let max = -Infinity;

    seen.add(point);

    const connections = graph[JSON.stringify(point)];

    for (const nx of Object.keys(connections)) {
      const nxPoint = JSON.parse(nx) as Point;
      if (!seen.has(nxPoint))
        max = Math.max(max, dfs(nxPoint) + connections[nx]);
    }

    seen.delete(point);

    return max;
  };

  return dfs(start);
}

function part1(input: string) {
  const data = handleInput(input);

  return getLongestPath(data, true);
}

export default part1(input);
