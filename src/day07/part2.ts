import { parseInput } from '../util';
import {
  cardSort,
  frequency,
  Hand,
  HandData,
  reduceSum,
  sortDesc,
} from './part1';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * To make things a little more interesting, the Elf introduces one additional rule. Now, J cards are jokers - wildcards that can act like whatever card would make the hand the strongest type possible.
 *
 * To balance this, J cards are now the weakest individual cards, weaker even than 2. The other cards stay in the same order: A, K, Q, T, 9, 8, 7, 6, 5, 4, 3, 2, J.
 *
 * J cards can pretend to be whatever card is best for the purpose of determining hand type; for example, QJJQ2 is now considered four of a kind. However, for the purpose of breaking ties between two hands of the same type, J is always treated as J, not the card it's pretending to be: JKKK2 is weaker than QQQQ2 because J is weaker than Q.
 *
 * Now, the above example goes very differently:
 *
 * 32T3K 765
 * T55J5 684
 * KK677 28
 * KTJJT 220
 * QQQJA 483
 * 32T3K is still the only one pair; it doesn't contain any jokers, so its strength doesn't increase.
 * KK677 is now the only two pair, making it the second-weakest hand.
 * T55J5, KTJJT, and QQQJA are now all four of a kind! T55J5 gets rank 3, QQQJA gets rank 4, and KTJJT gets rank 5.
 * With the new joker rule, the total winnings in this example are 5905.
 *
 * Using the new joker rule, find the rank of every hand in your set. What are the new total winnings?
 */
const STRENGTH = 'J23456789TQKA';
function part2(data: Hand[]): number {
  return data
    .map((line: string) => {
      const [cards, bid] = line.split(' ');
      const cardValues: number[] = cards
        .split('')
        .map((card: string) => STRENGTH.indexOf(card));
      const frequencies: { [key: number]: number } = frequency(cardValues);

      const jokers: number | undefined = frequencies[0];
      delete frequencies[0];

      const handHash: number[] = Object.values(frequencies).sort(sortDesc);
      if (jokers) {
        handHash[0] ??= 0;
        handHash[0] += jokers;
      }

      return {
        sort: handHash.concat(cardValues),
        bid: Number(bid),
      } as HandData;
    })
    .sort((a: HandData, b: HandData) => {
      return cardSort(b.sort, a.sort);
    })
    .map((hand: HandData, index: number) => hand.bid * (index + 1))
    .reduce(reduceSum);
}

export default part2(input);
