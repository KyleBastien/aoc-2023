import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * Your calculation isn't quite right. It looks like some of the digits are actually spelled out with letters: one, two, three, four, five, six, seven, eight, and nine also count as valid "digits".
 *
 * Equipped with this new information, you now need to find the real first and last digit on each line. For example:
 *
 * two1nine
 * eightwothree
 * abcone2threexyz
 * xtwone3four
 * 4nineeightseven2
 * zoneight234
 * 7pqrstsixteen
 * In this example, the calibration values are 29, 83, 13, 24, 42, 14, and 76. Adding these together produces 281.
 *
 * What is the sum of all of the calibration values?
 */
const numberWords: { [key: string]: number } = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function findFirstNumber(inputString: string): number | null {
  let minIndex = Infinity;

  for (const word in numberWords) {
    const index = inputString.indexOf(word);
    if (index !== -1 && index < minIndex) {
      minIndex = index;
    }
  }

  for (const char of inputString) {
    if (!isNaN(parseInt(char))) {
      const index = inputString.indexOf(char);
      if (index !== -1 && index < minIndex) {
        minIndex = index;
      }
    }
  }

  if (minIndex === Infinity) {
    return null;
  }

  const firstChar = inputString[minIndex];
  if (!isNaN(parseInt(firstChar))) {
    return parseInt(firstChar);
  }

  for (const word in numberWords) {
    if (inputString.substring(minIndex, minIndex + word.length) === word) {
      return numberWords[word];
    }
  }

  return null; // Return null if no number is found
}

function findLastNumber(inputString: string): number | null {
  for (let i = inputString.length - 1; i >= 0; i--) {
    const char = inputString[i];
    if (!isNaN(parseInt(char))) {
      return parseInt(char);
    }
    for (const word in numberWords) {
      if (inputString.substring(i - word.length + 1, i + 1) === word) {
        return numberWords[word];
      }
    }
  }
  console.log('No number found in string', inputString);
  return null; // Return null if no number is found
}

export const part2 = () => {
  const sum = input.reduce((acc, current) => {
    // find first number in current string like pqr3stu8vwx, should be 3
    console.log('current', current);
    const firstNumber = findFirstNumber(current);
    console.log('firstNumber', firstNumber);
    const lastNumber = findLastNumber(current);

    // combine firstNumber and lastNumber to form a single two-digit number
    const combined = (firstNumber ?? 0) * 10 + (lastNumber ?? 0);

    return acc + combined;
  }, 0);

  return sum;
};

export default part2();
