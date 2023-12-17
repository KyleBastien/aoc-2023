import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Day 17: Clumsy Crucible ---
 * The lava starts flowing rapidly once the Lava Production Facility is operational. As you leave, the reindeer offers you a parachute, allowing you to quickly reach Gear Island.
 *
 * As you descend, your bird's-eye view of Gear Island reveals why you had trouble finding anyone on your way up: half of Gear Island is empty, but the half below you is a giant factory city!
 *
 * You land near the gradually-filling pool of lava at the base of your new lavafall. Lavaducts will eventually carry the lava throughout the city, but to make use of it immediately, Elves are loading it into large crucibles on wheels.
 *
 * The crucibles are top-heavy and pushed by hand. Unfortunately, the crucibles become very difficult to steer at high speeds, and so it can be hard to go in a straight line for very long.
 *
 * To get Desert Island the machine parts it needs as soon as possible, you'll need to find the best way to get the crucible from the lava pool to the machine parts factory. To do this, you need to minimize heat loss while choosing a route that doesn't require the crucible to go in a straight line for too long.
 *
 * Fortunately, the Elves here have a map (your puzzle input) that uses traffic patterns, ambient temperature, and hundreds of other parameters to calculate exactly how much heat loss can be expected for a crucible entering any particular city block.
 *
 * For example:
 *
 * 2413432311323
 * 3215453535623
 * 3255245654254
 * 3446585845452
 * 4546657867536
 * 1438598798454
 * 4457876987766
 * 3637877979653
 * 4654967986887
 * 4564679986453
 * 1224686865563
 * 2546548887735
 * 4322674655533
 * Each city block is marked by a single digit that represents the amount of heat loss if the crucible enters that block. The starting point, the lava pool, is the top-left city block; the destination, the machine parts factory, is the bottom-right city block. (Because you already start in the top-left block, you don't incur that block's heat loss unless you leave that block and then return to it.)
 *
 * Because it is difficult to keep the top-heavy crucible going in a straight line for very long, it can move at most three blocks in a single direction before it must turn 90 degrees left or right. The crucible also can't reverse direction; after entering each city block, it may only turn left, continue straight, or turn right.
 *
 * One way to minimize heat loss is this path:
 *
 * 2>>34^>>>1323
 * 32v>>>35v5623
 * 32552456v>>54
 * 3446585845v52
 * 4546657867v>6
 * 14385987984v4
 * 44578769877v6
 * 36378779796v>
 * 465496798688v
 * 456467998645v
 * 12246868655<v
 * 25465488877v5
 * 43226746555v>
 * This path never moves more than three consecutive blocks in the same direction and incurs a heat loss of only 102.
 *
 * Directing the crucible from the lava pool to the machine parts factory, but not moving more than three consecutive blocks in the same direction, what is the least heat loss it can incur?
 */
type Position = [number, number];
type QueueItem = [number, number, number, number];

const DIRS: Position[] = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

function inRange(pos: Position, arr: number[][]): boolean {
  return (
    pos[0] >= 0 && pos[0] < arr.length && pos[1] >= 0 && pos[1] < arr[0].length
  );
}

class PriorityQueue {
  heap: QueueItem[];

  constructor() {
    this.heap = [];
  }

  push(item: QueueItem) {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  pop(): QueueItem {
    const top = this.heap[0];
    const last = this.heap.pop() as QueueItem;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    return top;
  }

  heapifyUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[parentIndex][0] <= this.heap[index][0]) {
        break;
      }
      [this.heap[parentIndex], this.heap[index]] = [
        this.heap[index],
        this.heap[parentIndex],
      ];
      index = parentIndex;
    }
  }

  heapifyDown(index: number) {
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;
    let smallest = index;

    if (
      leftChild < this.heap.length &&
      this.heap[leftChild][0] < this.heap[smallest][0]
    ) {
      smallest = leftChild;
    }

    if (
      rightChild < this.heap.length &&
      this.heap[rightChild][0] < this.heap[smallest][0]
    ) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      this.heapifyDown(smallest);
    }
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }
}

export function run(ll: number[][], mindist: number, maxdist: number): number {
  const maxRows = ll.length;
  const maxCols = ll[0].length;
  const q = new PriorityQueue();
  q.push([0, 0, 0, -1]);
  const seen: Set<string> = new Set();
  const costs: { [key: string]: number } = {};

  while (!q.isEmpty()) {
    const [cost, x, y, dd] = q.pop();

    if (x === maxRows - 1 && y === maxCols - 1) {
      return cost;
    }

    if (seen.has(`${x},${y},${dd}`)) {
      continue;
    }

    seen.add(`${x},${y},${dd}`);

    for (let direction = 0; direction < 4; direction++) {
      let costIncrease = 0;

      if (direction === dd || (direction + 2) % 4 === dd) {
        continue;
      }

      for (let distance = 1; distance < maxdist + 1; distance++) {
        const xx = x + DIRS[direction][0] * distance;
        const yy = y + DIRS[direction][1] * distance;

        if (inRange([xx, yy], ll)) {
          costIncrease += ll[xx][yy];

          if (distance < mindist) {
            continue;
          }

          const nc = cost + costIncrease;
          const key = `${xx},${yy},${direction}`;

          if (costs[key] !== undefined && costs[key] <= nc) {
            continue;
          }

          costs[key] = nc;
          q.push([nc, xx, yy, direction]);
        }
      }
    }
  }

  return -1;
}

function part1(input: string[]): number {
  const ll: number[][] = input.map(row => row.split('').map(Number));
  return run(ll, 1, 3);
}

export default part1(input);
