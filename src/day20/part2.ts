import { parseInput } from '../util';
import { mapValues, intersection } from 'lodash';

const input = parseInput({ split: false });

/**
 * --- Part Two ---
 * The final machine responsible for moving the sand down to Island Island has a module attached named rx. The machine turns on when a single low pulse is sent to rx.
 *
 * Reset all modules to their default states. Waiting for all pulses to be fully handled after each button press, what is the fewest number of button presses required to deliver a single low pulse to the module named rx?
 */
function factorsOf(num: number): number[] {
  const sqrt = Math.sqrt(num);
  const factors = [1, num];
  if (Math.round(sqrt) === sqrt) {
    factors.push(sqrt);
  }
  for (let i = 2; i < sqrt; i++) {
    const quotient = num / i;
    if (Math.round(quotient) === quotient) {
      factors.push(i, quotient);
    }
  }
  return factors;
}

function leastCommonMultiple(...patternLengths: number[]): number {
  return patternLengths.reduce((total, steps) => {
    const largestFactor = Math.max(
      ...intersection(...[total, steps].map(n => factorsOf(n))),
    );
    return (total * steps) / largestFactor;
  }, 1);
}

interface IModule {
  label: string;
  type: 'broadcaster' | '%' | '&';
  destinations: string[];
  // on or off for % module
  state: boolean;
  // low (false) or high (true) pulse
  memory: { [key: string]: boolean };
  lowPulsesSent: number;
  highPulsesSent: number;
}

function part2(input: string) {
  const modules = new Map<string, IModule>(
    input.split('\n').map(line => {
      const destinations = line
        .substring(line.indexOf('>') + 1)
        .split(',')
        .map(s => s.trim());
      const label = line.match(/\w+/)![0];
      return [
        label,
        {
          label: label,
          type: line[0] === 'b' ? 'broadcaster' : (line[0] as IModule['type']),
          destinations: destinations,
          // on or off for % module
          state: false,
          // low (0) or high (1) pulse
          memory: {}, // filled in later
          lowPulsesSent: 0,
          highPulsesSent: 0,
        },
      ];
    }),
  );

  // for all & modules, find their inputs
  Array.from(modules.values())
    .filter(m => m.type === '&')
    .forEach(m => {
      const inputs = Array.from(modules.values()).filter(m2 =>
        m2.destinations.includes(m.label),
      );
      inputs.forEach(input => (m.memory[input.label] = false));
    });

  const queue: { pulse: boolean; module: IModule; sender?: string }[] = [];

  // low pulses are represented by `false`, and high pulses are represented by `true`
  const addToQueue = (
    pulse: boolean,
    destinationName: string,
    sender?: IModule,
  ) => {
    if (sender != null) {
      pulse ? sender.highPulsesSent++ : sender.lowPulsesSent++;
    }
    queue.unshift({
      pulse: pulse,
      module: modules.get(destinationName)!,
      sender: sender?.label ?? '',
    });
  };

  // there is only one module which can send a pulse to module rx, and that's module vf.
  // Module vf is a conjunction module, so it will only send a low pulse to rx when it has received a high pulse from all its inputs.
  // From careful analysis of the button-press cycles (i.e. console.log statements), we learn that on button-press cycles where one of
  // vf's inputs sends a high pulse, that same input will send a low pulse before the cycle has completed.
  // This means that vf will only send a low pulse to rx if all of vf's inputs send it a high pulse in the same cycle.
  // We also learn from analysis that each of vf's inputs regularly sends a high pulse to it every n cycles, and that each of those cycles
  // starts at the 0th button press.
  // Keep track of what n is for each input.
  const vfInputMemoryLoops: { [key: string]: number } = (mapValues(
    modules.get('vf')?.memory,
    () => null,
  ) as unknown) as { [key: string]: number };
  let buttonPresses = 0;

  const pushButton = () => {
    buttonPresses++;
    addToQueue(false, 'broadcaster');

    // process the queue
    while (queue.length > 0) {
      const item = queue.pop();
      if (!item) {
        continue;
      }
      if (item.module == null) {
        continue;
      }

      if (item.module.type === 'broadcaster') {
        item.module.destinations.forEach(d =>
          addToQueue(false, d, item.module),
        );
      } else if (item.module.type === '%' && !item.pulse) {
        item.module.state = !item.module.state;
        item.module.destinations.forEach(d =>
          addToQueue(item.module.state, d, item.module),
        );
      } else if (item.module.type === '&') {
        if (item.module.label === 'vf') {
          // if this is the first time that one of vf's inputs sends a high pulse, record the cycle length
          if (vfInputMemoryLoops[item.sender!] == null && item.pulse) {
            vfInputMemoryLoops[item.sender!] = buttonPresses;
          }
        }
        // remember the state of the input
        item.module.memory[item.sender!] = item.pulse;
        const pulseToSend = !Object.values(item.module.memory).every(p => p);
        console.log(
          `${item.module.type}${item.module.label} sending ${pulseToSend} to `,
          item.module.destinations,
        );
        item.module.destinations.forEach(d =>
          addToQueue(pulseToSend, d, item.module),
        );
      }
    }
  };

  for (let i = 0; i < Number.MAX_SAFE_INTEGER; i++) {
    pushButton();
    const memoryLoopValues = Object.values(vfInputMemoryLoops);
    // if we've found all cycle lengths, output when they will all coincide
    if (memoryLoopValues.every(v => v != null)) {
      console.log(memoryLoopValues);
      return leastCommonMultiple(...memoryLoopValues);
    }
  }

  let totalLow = 1000; // every button push sends a low pulse, which is not accounted for in the rest of the code
  let totalHigh = 0;
  Array.from(modules.values()).forEach(m => {
    totalLow += m.lowPulsesSent;
    totalHigh += m.highPulsesSent;
  });
  return totalLow * totalHigh;
}

export default part2(input);
