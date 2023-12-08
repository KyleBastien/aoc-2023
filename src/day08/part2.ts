import { parseInput } from '../util';

const input = parseInput({ split: { mapper: false } });

/**
 * --- Part Two ---
 * The sandstorm is upon you and you aren't any closer to escaping the wasteland. You had the camel follow the instructions, but you've barely left your starting position. It's going to take significantly more steps to escape!
 *
 * What if the map isn't for people - what if the map is for ghosts? Are ghosts even bound by the laws of spacetime? Only one way to find out.
 *
 * After examining the maps a bit longer, your attention is drawn to a curious fact: the number of nodes with names ending in A is equal to the number ending in Z! If you were a ghost, you'd probably just start at every node that ends with A and follow all of the paths at the same time until they all simultaneously end up at nodes that end with Z.
 *
 * For example:
 *
 * LR
 *
 * 11A = (11B, XXX)
 * 11B = (XXX, 11Z)
 * 11Z = (11B, XXX)
 * 22A = (22B, XXX)
 * 22B = (22C, 22C)
 * 22C = (22Z, 22Z)
 * 22Z = (22B, 22B)
 * XXX = (XXX, XXX)
 * Here, there are two starting nodes, 11A and 22A (because they both end with A). As you follow each left/right instruction, use that instruction to simultaneously navigate away from both nodes you're currently on. Repeat this process until all of the nodes you're currently on end with Z. (If only some of the nodes you're on end with Z, they act like any other node and you continue as normal.) In this example, you would proceed as follows:
 *
 * Step 0: You are at 11A and 22A.
 * Step 1: You choose all of the left paths, leading you to 11B and 22B.
 * Step 2: You choose all of the right paths, leading you to 11Z and 22C.
 * Step 3: You choose all of the left paths, leading you to 11B and 22Z.
 * Step 4: You choose all of the right paths, leading you to 11Z and 22B.
 * Step 5: You choose all of the left paths, leading you to 11B and 22C.
 * Step 6: You choose all of the right paths, leading you to 11Z and 22Z.
 * So, in this example, you end up entirely on nodes that end in Z after 6 steps.
 *
 * Simultaneously start on every node that ends with A. How many steps does it take before you're only on nodes that end with Z?
 */
interface Node {
  left: string;
  right: string;
}

function handleInput(lines: string[]): [string, Map<string, Node>] {
  const instructions = lines[0];

  const graph: Map<string, Node> = new Map();

  for (const line of lines.slice(2)) {
    const [node, left, right] = line.match(/[A-Z]{3}/g)!;
    graph.set(node, { left, right });
  }

  return [instructions, graph];
}

function part2(input: string[]): number {
  const [instructions, graph] = handleInput(input);

  const nodesEndingA: string[] = [];
  const cycles: number[] = [];

  for (const node of graph.keys()) {
    if (node.endsWith('A')) {
      nodesEndingA.push(node);
      cycles.push(0);
    }
  }

  const currs = [...nodesEndingA];

  for (let step = 1; ; step++) {
    for (let c = 0; c < currs.length; c++) {
      currs[c] = graph.get(currs[c])![
        instructions[(step - 1) % instructions.length] === 'R'
          ? 'right'
          : 'left'
      ];
      if (currs[c].endsWith('Z')) {
        cycles[c] = step;
      }
    }

    if (cycles.every(cy => cy !== 0)) {
      // Calculate the least common multiple (LCM) of cycles
      return cycles.reduce((a, b) => (a * b) / gcd(a, b));
    }
  }
}

// Helper function to calculate greatest common divisor (GCD)
function gcd(a: number, b: number): number {
  if (b === 0) {
    return a;
  }
  return gcd(b, a % b);
}

export default part2(input);
