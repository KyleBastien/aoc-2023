import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

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
