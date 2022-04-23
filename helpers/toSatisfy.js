// DO NOT MODIFY THIS FILE
export function toSatisfy(calculator, sequence) {
  validate(sequence, calculator, this.utils);
  return { message: () => "passed", pass: true };
}

global.eval = undefined;
global.Function = undefined;
function validate(sequence, calculator, utils) {
  let sequenceIndex = 0;
  try {
    while (sequenceIndex < sequence.length) {
      const code = sequence[sequenceIndex];
      switch (code) {
        case "#":
          return;
        case " ":
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          calculator.enterNumber(+code);
          break;
        case "C":
          calculator.clear();
          break;
        case "M":
          calculator.saveMemory();
          break;
        case "m":
          calculator.clearMemory();
          break;
        case "+":
          calculator.addition();
          break;
        case "-":
          calculator.substraction();
          break;
        case "*":
          calculator.multiplication();
          break;
        case "/":
          calculator.division();
          break;
        case ",":
          calculator.next();
          break;
        case "p":
          calculator.prime();
          break;
        case "[":
          sequenceIndex = validateOutput(
            sequence,
            calculator,
            sequenceIndex,
            utils
          );
          break;
        default:
          throw new Error(`Unkown sequence character "${code}"`);
      }
      sequenceIndex += 1;
    }
  } catch (e) {
    const spaces = Array(sequenceIndex + 1).join(" ");
    e.message +=
      "\n\n" +
      `Error raised at: "${sequence}"\n` +
      `                  ${spaces}^\n\n`;
    e.sequenceIndex = sequenceIndex;
    throw e;
  }
}

function validateOutput(sequence, calculator, sequenceIndex, utils) {
  const end = sequence.indexOf("]", sequenceIndex);
  const number = +sequence.slice(sequenceIndex + 1, end);

  const display = calculator.getDisplay();
  if (typeof display !== "number") {
    throw new Error(
      `Display expected to be a number, but it is a ${typeof display}.`
    );
  }
  if (display !== number) {
    throw new Error(
      `Display shows an incorrect number.\n\n` +
        `Expected: ${utils.printExpected(number)}\n` +
        `Received: ${utils.printReceived(display)}`
    );
  }

  return end;
}
