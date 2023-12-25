import { parseInput } from '../util/index.js';

const input = parseInput({ split: false });

/**
 * --- Day 21: Step Counter ---
 * You manage to catch the airship right as it's dropping someone else off on their all-expenses-paid trip to Desert Island! It even helpfully drops you off near the gardener and his massive farm.
 *
 * "You got the sand flowing again! Great work! Now we just need to wait until we have enough sand to filter the water for Snow Island and we'll have snow again in no time."
 *
 * While you wait, one of the Elves that works with the gardener heard how good you are at solving problems and would like your help. He needs to get his steps in for the day, and so he'd like to know which garden plots he can reach with exactly his remaining 64 steps.
 *
 * He gives you an up-to-date map (your puzzle input) of his starting position (S), garden plots (.), and rocks (#). For example:
 *
 * ...........
 * .....###.#.
 * .###.##..#.
 * ..#.#...#..
 * ....#.#....
 * .##..S####.
 * .##..#...#.
 * .......##..
 * .##.#.####.
 * .##..##.##.
 * ...........
 * The Elf starts at the starting position (S) which also counts as a garden plot. Then, he can take one step north, south, east, or west, but only onto tiles that are garden plots. This would allow him to reach any of the tiles marked O:
 *
 * ...........
 * .....###.#.
 * .###.##..#.
 * ..#.#...#..
 * ....#O#....
 * .##.OS####.
 * .##..#...#.
 * .......##..
 * .##.#.####.
 * .##..##.##.
 * ...........
 * Then, he takes a second step. Since at this point he could be at either tile marked O, his second step would allow him to reach any garden plot that is one step north, south, east, or west of any tile that he could have reached after the first step:
 *
 * ...........
 * .....###.#.
 * .###.##..#.
 * ..#.#O..#..
 * ....#.#....
 * .##O.O####.
 * .##.O#...#.
 * .......##..
 * .##.#.####.
 * .##..##.##.
 * ...........
 * After two steps, he could be at any of the tiles marked O above, including the starting position (either by going north-then-south or by going west-then-east).
 *
 * A single third step leads to even more possibilities:
 *
 * ...........
 * .....###.#.
 * .###.##..#.
 * ..#.#.O.#..
 * ...O#O#....
 * .##.OS####.
 * .##O.#...#.
 * ....O..##..
 * .##.#.####.
 * .##..##.##.
 * ...........
 * He will continue like this until his steps for the day have been exhausted. After a total of 6 steps, he could reach any of the garden plots marked O:
 *
 * ...........
 * .....###.#.
 * .###.##.O#.
 * .O#O#O.O#..
 * O.O.#.#.O..
 * .##O.O####.
 * .##.O#O..#.
 * .O.O.O.##..
 * .##.#.####.
 * .##O.##.##.
 * ...........
 * In this example, if the Elf's goal was to get exactly 6 more steps today, he could use them to reach any of 16 garden plots.
 *
 * However, the Elf actually needs to get 64 steps today, and the map he's handed you is much larger than the example map.
 *
 * Starting from the garden plot marked S on your map, how many garden plots could the Elf reach in exactly 64 steps?
 */
export type Point = [number, number];
type Grid = ('S' | '.' | '#')[][];
type Instructions = [start: Point, grid: Grid];

export class TupleSet<TTuple extends unknown[]> {
  #set: Set<string>;

  constructor(iterable?: TTuple[] | TupleSet<TTuple> | Set<TTuple>) {
    if (!iterable) {
      this.#set = new Set<string>();
      return;
    }

    const strings = [...iterable].map(point => JSON.stringify(point));
    this.#set = new Set<string>(strings);
  }

  get size() {
    return this.#set.size;
  }

  *[Symbol.iterator]() {
    for (const value of this.#set[Symbol.iterator]()) {
      yield JSON.parse(value) as TTuple;
    }
  }

  add(point: TTuple) {
    this.#set.add(JSON.stringify(point));
    return this;
  }

  clear() {
    this.#set.clear();
  }

  delete(point: TTuple) {
    return this.#set.delete(JSON.stringify(point));
  }

  *entries(): IterableIterator<[TTuple, TTuple]> {
    for (const [value1, value2] of this.#set.entries()) {
      yield [JSON.parse(value1), JSON.parse(value2)] as [
        point: TTuple,
        point: TTuple,
      ];
    }
  }

  forEach(
    callbackfn: (
      point: TTuple,
      point2: TTuple,
      points: TupleSet<TTuple>,
    ) => void,
    thisArg?: unknown,
  ) {
    this.#set.forEach(value => {
      const point = JSON.parse(value) as TTuple;
      callbackfn.call(thisArg, point, point, this);
    });
  }

  has(point: TTuple) {
    return this.#set.has(JSON.stringify(point));
  }

  *keys(): IterableIterator<TTuple> {
    for (const key of this.#set.keys()) {
      yield JSON.parse(key) as TTuple;
    }
  }

  *values(): IterableIterator<TTuple> {
    for (const value of this.#set.values()) {
      yield JSON.parse(value) as TTuple;
    }
  }
}

export class Points extends TupleSet<Point> {}

export function handleInput(text: string): Instructions {
  let start: Point = [0, 0];
  const grid = text.split('\n').map((line, r) => {
    const tiles = line.split('') as ('S' | '.' | '#')[];
    const c = tiles.indexOf('S');
    if (c > -1) {
      start = [r, c];
      tiles[c] = '.';
    }
    return tiles;
  }) as Grid;

  return [start, grid];
}

export function fillGrid([start, grid]: Instructions, steps: number): number {
  const answers = new Points();
  const seen = new Points();
  const queue: [Point, number][] = [[start, steps]];

  while (queue.length) {
    const [point, steps] = queue.shift()!;

    if (steps % 2 === 0) answers.add(point);

    if (!steps) continue;

    for (const [r, c] of neighbors(point, grid)) {
      if (seen.has([r, c])) continue;
      seen.add([r, c]);
      queue.push([[r, c], steps - 1]);
    }
  }

  return answers.size;
}

function neighbors([r, c]: Point, grid: Grid): Point[] {
  const directions: [number, number][] = [
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
  ];

  const validNeighbors: Point[] = [];

  for (const [dr, dc] of directions) {
    const newR = r + dr;
    const newC = c + dc;
    if (
      newR >= 0 &&
      newR < grid.length &&
      newC >= 0 &&
      newC < grid[0].length &&
      grid[newR][newC] === '.'
    ) {
      validNeighbors.push([newR, newC]);
    }
  }

  return validNeighbors;
}

function part1(input: string): number {
  const instructions = handleInput(input);

  return fillGrid(instructions, 64);
}

export default part1(input);
