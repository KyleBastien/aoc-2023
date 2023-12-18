import { parseInput } from '../util';
import { calculatePolygonArea } from './part1';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * The Elves were right to be concerned; the planned lagoon would be much too small.
 *
 * After a few minutes, someone realizes what happened; someone swapped the color and instruction parameters when producing the dig plan. They don't have time to fix the bug; one of them asks if you can extract the correct instructions from the hexadecimal codes.
 *
 * Each hexadecimal code is six hexadecimal digits long. The first five hexadecimal digits encode the distance in meters as a five-digit hexadecimal number. The last hexadecimal digit encodes the direction to dig: 0 means R, 1 means D, 2 means L, and 3 means U.
 *
 * So, in the above example, the hexadecimal codes can be converted into the true instructions:
 *
 * #70c710 = R 461937
 * #0dc571 = D 56407
 * #5713f0 = R 356671
 * #d2c081 = D 863240
 * #59c680 = R 367720
 * #411b91 = D 266681
 * #8ceee2 = L 577262
 * #caa173 = U 829975
 * #1b58a2 = L 112010
 * #caa171 = D 829975
 * #7807d2 = L 491645
 * #a77fa3 = U 686074
 * #015232 = L 5411
 * #7a21e3 = U 500254
 * Digging out this loop and its interior produces a lagoon that can hold an impressive 952408144115 cubic meters of lava.
 *
 * Convert the hexadecimal color codes into the correct instructions; if the Elves follow this new dig plan, how many cubic meters of lava could the lagoon hold?
 */
function hexToInstructions(
  hex: string,
): { direction: [number, number]; distance: number } {
  const dirMap: [number, number][] = [
    [0, 1], // R
    [-1, 0], // D
    [0, -1], // L
    [1, 0], // U
  ];

  const curDir = dirMap[parseInt(hex.charAt(hex.length - 2), 16)];
  const curLen = parseInt(hex.slice(-7, -2), 16);

  return { direction: curDir, distance: curLen };
}

function part2(input: string[]): number {
  let numPts = 0;
  const xs: number[] = [];
  const ys: number[] = [];
  let loc: [number, number] = [0, 0];

  for (const line of input) {
    const [a, b, c] = line.split(' ');
    if (a === '' || b === '' || c === '') continue;

    const { direction, distance } = hexToInstructions(c);

    numPts += distance;
    loc = [loc[0] + distance * direction[0], loc[1] + distance * direction[1]];
    xs.push(loc[0]);
    ys.push(loc[1]);
  }

  const polygonArea = calculatePolygonArea(xs, ys);
  const b = numPts;

  if (b % 2 !== 0) throw new Error('Invalid number of points');

  const I = polygonArea + 1 - b / 2;
  return I + b;
}

export default part2(input);
