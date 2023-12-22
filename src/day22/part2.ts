import { parseInput } from '../util';
import { handleInput, simulate } from './part1';

const input = parseInput({ split: false });

/**
 * --- Part Two ---
 * Disintegrating bricks one at a time isn't going to be fast enough. While it might sound dangerous, what you really need is a chain reaction.
 *
 * You'll need to figure out the best brick to disintegrate. For each brick, determine how many other bricks would fall if that brick were disintegrated.
 *
 * Using the same example as above:
 *
 * Disintegrating brick A would cause all 6 other bricks to fall.
 * Disintegrating brick F would cause only 1 other brick, G, to fall.
 * Disintegrating any other brick would cause no other bricks to fall. So, in this example, the sum of the number of other bricks that would fall as a result of disintegrating each brick is 7.
 *
 * For each brick, determine how many other bricks would fall if that brick were disintegrated. What is the sum of the number of other bricks that would fall?
 */
function part2(input: string) {
  const bricks = handleInput(input);

  const [kSupportsV, vSupportsK] = simulate(bricks);

  let total = 0;

  for (const i of bricks.keys()) {
    const queue = [...kSupportsV[i]].filter(j => vSupportsK[j].size === 1);
    const falling = new Set(queue);

    falling.add(i);

    while (queue.length) {
      const j = queue.shift()!;

      for (const k of kSupportsV[j]) {
        if (falling.has(k)) continue;

        if ([...vSupportsK[k]].every(l => falling.has(l))) {
          queue.push(k);
          falling.add(k);
        }
      }
    }

    total += falling.size - 1;
  }

  return total;
}

export default part2(input);
