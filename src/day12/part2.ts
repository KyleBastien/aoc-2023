import { parseInput } from '../util';
import { getCount } from './part1';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * As you look out at the field of springs, you feel like there are way more springs than the condition records list. When you examine the records, you discover that they were actually folded up this whole time!
 *
 * To unfold the records, on each row, replace the list of spring conditions with five copies of itself (separated by ?) and replace the list of contiguous groups of damaged springs with five copies of itself (separated by ,).
 *
 * So, this row:
 *
 * .# 1
 * Would become:
 *
 * .#?.#?.#?.#?.# 1,1,1,1,1
 * The first line of the above example would become:
 *
 * ???.###????.###????.###????.###????.### 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3
 * In the above example, after unfolding, the number of possible arrangements for some rows is now much larger:
 *
 * ???.### 1,1,3 - 1 arrangement
 * .??..??...?##. 1,1,3 - 16384 arrangements
 * ?#?#?#?#?#?#?#? 1,3,1,6 - 1 arrangement
 * ????.#...#... 4,1,1 - 16 arrangements
 * ????.######..#####. 1,6,5 - 2500 arrangements
 * ?###???????? 3,2,1 - 506250 arrangements
 * After unfolding, adding all of the possible arrangement counts together produces 525152.
 *
 * Unfold your condition records; what is the new sum of possible arrangement counts?
 */
function part2(rows: string[]): number {
  let res = 0;
  for (const row of rows) {
    const [data, numbers] = row.split(' ');
    console.log('data', data);
    // Split the numbers by comma and convert to numbers
    const originalCounts: number[] = numbers.split(',').map(Number);
    // Release the entire counts array 5 times, e.g., 1,1,3 -> 1,1,3,1,1,3,1,1,3,1,1,3,1,1,3
    const unfoldedCounts = originalCounts.slice();
    for (let i = 0; i < 4; i++) {
      unfoldedCounts.push(...originalCounts);
    }
    console.log('unfoldedCounts', unfoldedCounts);
    const line = (data + '?').repeat(4) + data + '.';
    console.log('line', line);
    const count = getCount({}, line, unfoldedCounts, 0, 0, 0);
    console.log('count', count);
    res += count;
  }
  return res;
}

export default part2(input);
