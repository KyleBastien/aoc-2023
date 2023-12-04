import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Day 3: Gear Ratios ---
 * You and the Elf eventually reach a gondola lift station; he says the gondola lift will take you up to the water source, but this is as far as he can bring you. You go inside.
 *
 * It doesn't take long to find the gondolas, but there seems to be a problem: they're not moving.
 *
 * "Aaah!"
 *
 * You turn around to see a slightly-greasy Elf with a wrench and a look of surprise. "Sorry, I wasn't expecting anyone! The gondola lift isn't working right now; it'll still be a while before I can fix it." You offer to help.
 *
 * The engineer explains that an engine part seems to be missing from the engine, but nobody can figure out which one. If you can add up all the part numbers in the engine input, it should be easy to work out which part is missing.
 *
 * The engine input (your puzzle input) consists of a visual representation of the engine. There are lots of numbers and symbols you don't really understand, but apparently any number adjacent to a symbol, even diagonally, is a "part number" and should be included in your sum. (Periods (.) do not count as a symbol.)
 *
 * Here is an example engine input:
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
 * In this input, two numbers are not part numbers because they are not adjacent to a symbol: 114 (top right) and 58 (middle right). Every other number is adjacent to a symbol and so is a part number; their sum is 4361.
 *
 * Of course, the actual engine input is much larger. What is the sum of all of the part numbers in the engine input?
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

const part1 = (input: string[]) => {
  const { numberCoordinates, symbolCoordinates } = breakInput(input);

  return numberCoordinates.reduce((acc, numberCoordinate) => {
    const { startX, endX, y } = numberCoordinate;
    const adjacentSymbols = symbolCoordinates.filter(
      symbolCoordinate =>
        (symbolCoordinate.y === y ||
          symbolCoordinate.y === y - 1 ||
          symbolCoordinate.y === y + 1) &&
        symbolCoordinate.x >= startX - 1 &&
        symbolCoordinate.x <= endX + 1,
    );

    if (adjacentSymbols.length > 0) {
      return acc + numberCoordinate.number;
    }

    return acc;
  }, 0);
};

export default part1(input);
