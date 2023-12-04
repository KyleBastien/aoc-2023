import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 *
 * --- Part Two ---
 * The engineer finds the missing part and installs it in the engine! As the engine springs to life, you jump in the closest gondola, finally ready to ascend to the water source.
 *
 * You don't seem to be going very fast, though. Maybe something is still wrong? Fortunately, the gondola has a phone labeled "help", so you pick it up and the engineer answers.
 *
 * Before you can explain the situation, she suggests that you look out the window. There stands the engineer, holding a phone in one hand and waving with the other. You're going so slowly that you haven't even left the station. You exit the gondola.
 *
 * The missing part wasn't the only issue - one of the gears in the engine is wrong. A gear is any * symbol that is adjacent to exactly two part numbers. Its gear ratio is the result of multiplying those two numbers together.
 *
 * This time, you need to find the gear ratio of every gear and add them all up so that the engineer can figure out which gear needs to be replaced.
 *
 * Consider the same engine schematic again:
 *
 * 467..114..
 * ...*......
 * ..35..633.
 * ......#...
 * 617*......
 * .....+.58.
 * ..592.....
 * ......755.
 * ...$.*....
 * .664.598..
 * In this schematic, there are two gears. The first is in the top left; it has part numbers 467 and 35, so its gear ratio is 16345. The second gear is in the lower right; its gear ratio is 451490. (The * adjacent to 617 is not a gear because it is only adjacent to one part number.) Adding up all of the gear ratios produces 467835.
 *
 * What is the sum of all of the gear ratios in your engine schematic?
 */

type NumberCoordinate = {
  number: number;
  startX: number;
  endX: number;
  y: number;
};

type SymbolCoordinate = {
  symbol: string;
  x: number;
  y: number;
};

const breakInput = (parsed: string[]) => {
  const numberCoordinates: NumberCoordinate[] = [];
  const symbolCoordinates: SymbolCoordinate[] = [];

  for (let y = 0; y < parsed.length; y++) {
    for (let x = 0; x < parsed[y].length; x++) {
      const current = parsed[y][x];
      if (current === '.') continue;

      if (/\d/.test(current)) {
        const currentNumberIndex = numberCoordinates.findIndex(
          ({ endX, y: numberY }) => y === numberY && endX === x - 1,
        );
        if (currentNumberIndex > -1) {
          numberCoordinates[currentNumberIndex].endX = x;
          numberCoordinates[currentNumberIndex].number =
            10 * numberCoordinates[currentNumberIndex].number + Number(current);
        } else {
          numberCoordinates.push({
            number: Number(current),
            startX: x,
            endX: x,
            y,
          });
        }
      }

      if (/[^\d.]/.test(current)) {
        symbolCoordinates.push({
          symbol: current,
          x,
          y,
        });
      }
    }
  }

  return { numberCoordinates, symbolCoordinates };
};

const partTwo = (input: string[]) => {
  const { numberCoordinates, symbolCoordinates } = breakInput(input);

  return symbolCoordinates
    .filter(({ symbol }) => symbol === '*')
    .reduce((acc, symbolCoordinate) => {
      const { x, y } = symbolCoordinate;
      const adjacentNumbers = numberCoordinates.filter(
        numberCoordinate =>
          (numberCoordinate.y === y ||
            numberCoordinate.y === y - 1 ||
            numberCoordinate.y === y + 1) &&
          x >= numberCoordinate.startX - 1 &&
          x <= numberCoordinate.endX + 1,
      );

      if (adjacentNumbers.length === 2) {
        return acc + adjacentNumbers[0].number * adjacentNumbers[1].number;
      }

      return acc;
    }, 0);
};

export default partTwo(input);
