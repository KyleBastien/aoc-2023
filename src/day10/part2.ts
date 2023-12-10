import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * You quickly reach the farthest point of the loop, but the animal never emerges. Maybe its nest is within the area enclosed by the loop?
 *
 * To determine whether it's even worth taking the time to search for such a nest, you should calculate how many tiles are contained within the loop. For example:
 *
 * ...........
 * .S-------7.
 * .|F-----7|.
 * .||.....||.
 * .||.....||.
 * .|L-7.F-J|.
 * .|..|.|..|.
 * .L--J.L--J.
 * ...........
 * The above loop encloses merely four tiles - the two pairs of . in the southwest and southeast (marked I below). The middle . tiles (marked O below) are not in the loop. Here is the same loop again with those regions marked:
 *
 * ...........
 * .S-------7.
 * .|F-----7|.
 * .||OOOOO||.
 * .||OOOOO||.
 * .|L-7OF-J|.
 * .|II|O|II|.
 * .L--JOL--J.
 * .....O.....
 * In fact, there doesn't even need to be a full tile path to the outside for tiles to count as outside the loop - squeezing between pipes is also allowed! Here, I is still within the loop and O is still outside the loop:
 *
 * ..........
 * .S------7.
 * .|F----7|.
 * .||OOOO||.
 * .||OOOO||.
 * .|L-7F-J|.
 * .|II||II|.
 * .L--JL--J.
 * ..........
 * In both of the above examples, 4 tiles are enclosed by the loop.
 *
 * Here's a larger example:
 *
 * .F----7F7F7F7F-7....
 * .|F--7||||||||FJ....
 * .||.FJ||||||||L7....
 * FJL7L7LJLJ||LJ.L-7..
 * L--J.L7...LJS7F-7L7.
 * ....F-J..F7FJ|L7L7L7
 * ....L7.F7||L7|.L7L7|
 * .....|FJLJ|FJ|F7|.LJ
 * ....FJL-7.||.||||...
 * ....L---J.LJ.LJLJ...
 * The above sketch has many random bits of ground, some of which are in the loop (I) and some of which are outside it (O):
 *
 * OF----7F7F7F7F-7OOOO
 * O|F--7||||||||FJOOOO
 * O||OFJ||||||||L7OOOO
 * FJL7L7LJLJ||LJIL-7OO
 * L--JOL7IIILJS7F-7L7O
 * OOOOF-JIIF7FJ|L7L7L7
 * OOOOL7IF7||L7|IL7L7|
 * OOOOO|FJLJ|FJ|F7|OLJ
 * OOOOFJL-7O||O||||OOO
 * OOOOL---JOLJOLJLJOOO
 * In this larger example, 8 tiles are enclosed by the loop.
 *
 * Any tile that isn't part of the main loop can count as being enclosed by the loop. Here's another example with many bits of junk pipe lying around that aren't connected to the main loop at all:
 *
 * FF7FSF7F7F7F7F7F---7
 * L|LJ||||||||||||F--J
 * FL-7LJLJ||||||LJL-77
 * F--JF--7||LJLJ7F7FJ-
 * L---JF-JLJ.||-FJLJJ7
 * |F|F-JF---7F7-L7L|7|
 * |FFJF7L7F-JF7|JL---7
 * 7-L-JL7||F7|L7F-7F7|
 * L.L7LFJ|||||FJL7||LJ
 * L7JLJL-JLJLJL--JLJ.L
 * Here are just the tiles that are enclosed by the loop marked with I:
 *
 * FF7FSF7F7F7F7F7F---7
 * L|LJ||||||||||||F--J
 * FL-7LJLJ||||||LJL-77
 * F--JF--7||LJLJIF7FJ-
 * L---JF-JLJIIIIFJLJJ7
 * |F|F-JF---7IIIL7L|7|
 * |FFJF7L7F-JF7IIL---7
 * 7-L-JL7||F7|L7F-7F7|
 * L.L7LFJ|||||FJL7||LJ
 * L7JLJL-JLJLJL--JLJ.L
 * In this last example, 10 tiles are enclosed by the loop.
 *
 * Figure out whether you have time to search for the nest by calculating the area within the loop. How many tiles are enclosed by the loop?
 */
type Point = {
  x: number;
  y: number;
};

const part2 = (maze: string[]): number => {
  const height = maze.length;
  const width = maze[0].length;

  const directions: [number, number][] = [
    [0, 1], // right
    [1, 0], // downward
    [0, -1], // left
    [-1, 0], // upward
  ];

  const happy = ['-7J', '|LJ', '-FL', '|F7'];

  let startingPoint: Point = { x: -1, y: -1 };
  for (let i = 0; i < height; i++) {
    if (maze[i].includes('S')) {
      startingPoint = { x: i, y: maze[i].indexOf('S') };
      break;
    }
  }

  const Sdirs: number[] = [];
  for (let i = 0; i < 4; i++) {
    const pos = directions[i];
    const bx = startingPoint.x + pos[0];
    const by = startingPoint.y + pos[1];
    if (
      bx >= 0 &&
      bx < height &&
      by >= 0 &&
      by < width &&
      happy[i].includes(maze[bx][by])
    ) {
      Sdirs.push(i);
    }
  }
  const Svalid = Sdirs.includes(3);

  const transform: Record<string, number> = {
    '0-': 0,
    '07': 1,
    '0J': 3,
    '2-': 2,
    '2F': 1,
    '2L': 3,
    '1|': 1,
    '1L': 0,
    '1J': 2,
    '3|': 3,
    '3F': 0,
    '37': 2,
  };

  const O: number[][] = Array.from({ length: height }, () =>
    Array(width).fill(0),
  );

  let curdir = Sdirs[0];
  let { x: cx, y: cy } = {
    x: startingPoint.x + directions[curdir][0],
    y: startingPoint.y + directions[curdir][1],
  };

  O[startingPoint.x][startingPoint.y] = 1;
  while (!(cx === startingPoint.x && cy === startingPoint.y)) {
    O[cx][cy] = 1;
    curdir = transform[`${curdir}${maze[cx][cy]}`];
    cx += directions[curdir][0];
    cy += directions[curdir][1];
  }

  let ct = 0;
  for (let i = 0; i < height; i++) {
    let inn = false;
    for (let j = 0; j < width; j++) {
      if (O[i][j]) {
        if ('|JL'.includes(maze[i][j]) || (maze[i][j] === 'S' && Svalid)) {
          inn = !inn;
        }
      } else {
        ct += inn ? 1 : 0;
      }
    }
  }

  return ct;
};

export default part2(input);
