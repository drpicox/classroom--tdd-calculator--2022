import chalk from "chalk";
import figlet from "figlet";
import { toSatisfy } from "./toSatisfy";
expect.extend({ toSatisfy });

export function runSequences(sequences, Calculator) {
  const [failedIndex, error] = findFailingSequence(sequences, Calculator);

  writeHeaderStatus(sequences, failedIndex, error);
  writeSequencesSteps(sequences, failedIndex);
  writeFooterProgressNumber(sequences, failedIndex);

  process.stdout.write("\n\n");

  if (error) throwError(error, failedIndex);
}

function throwError(error, failedIndex) {
  const order = failedIndex + 1;
  const message = error.message;
  const location = ` ${order}`;
  const spaces = location.replace(/./g, " ");

  const newMessage = message
    .replace("Error raised at:", `Error raised at${location}:`)
    .replace("^", `${spaces}^`);

  error.message = newMessage;

  throw error;
}

function findFailingSequence(sequences, Calculator) {
  let nextSequenceIndex = 0;
  let error = null;
  try {
    while (nextSequenceIndex < sequences.length) {
      expect(new Calculator()).toSatisfy(sequences[nextSequenceIndex]);
      nextSequenceIndex += 1;
    }
  } catch (thrown) {
    error = thrown;
  }
  return [nextSequenceIndex, error];
}

function writeHeaderStatus(sequences, failedIndex, error) {
  if (!error) writeHeaderStatusPass();
  else writeHeaderStatusFail(sequences, failedIndex, error);
}

function writeHeaderStatusPass() {
  process.stdout.write(
    `${chalk.green.bold.inverse(" 100% ")} All examples passed successfully.\n`
  );
}

function writeHeaderStatusFail(sequences, failedIndex, error) {
  const prop = calculateProp(failedIndex, sequences);
  const lines = error.message.split("\n");
  const message = `${lines[0]}\n${chalk.bold(lines[3].slice(7))}`;

  const sequence = sequences[failedIndex];
  const order = failedIndex + 1;
  const { sequenceIndex } = error;
  const passedSequence = chalk.green(`"${sequence.slice(0, sequenceIndex)}`);
  const failedSequence = chalk.red.bold(`${sequence[sequenceIndex]}`);
  const unknownSequence = chalk.gray(`${sequence.slice(sequenceIndex + 1)}"`);

  process.stdout.write(
    `${chalk.bold.yellow.inverse(
      ` ${padLeft(prop, 3)}% `
    )} ${order}: ${passedSequence}${failedSequence}${unknownSequence}: ${message}\n`
  );
}

function writeSequencesSteps(sequences, failedIndex) {
  writePassedSequencesSteps(failedIndex, sequences);
  writeFailedSequencesStep(failedIndex, sequences);
  writeUnknownSequencesSteps(failedIndex, sequences);
}

function writePassedSequencesSteps(failedIndex, sequences) {
  for (let i = 0; i < failedIndex; i += 1) {
    writeSequenceStep(sequences, i, "pass");
  }
}

function writeFailedSequencesStep(failedIndex, sequences) {
  if (failedIndex < sequences.length)
    writeSequenceStep(sequences, failedIndex, "fail");
}

function writeUnknownSequencesSteps(failedIndex, sequences) {
  for (
    let i = failedIndex + 1;
    i < sequences.length && i < failedIndex + 3;
    i += 1
  ) {
    writeSequenceStep(sequences, i, "");
  }
}

function writeSequenceStep(sequences, index, state) {
  const sequence = sequences[index];
  const order = index + 1;
  const { gray, green, red } = chalk;
  const none = (x) => x;

  state = ["pass", "fail"].indexOf(state) + 1;
  const check = [" ", "✓", "✗"][state];
  const color = [none, green, red][state];
  const allColor = [gray.dim, none, none][state];

  process.stdout.write(
    allColor(
      `${color(`  ${check}`)} ${padRight(order + ":", 4)} ${color(
        `"${sequence}"`
      )}\n`
    )
  );
}

function writeFooterProgressNumber(sequences, failedIndex) {
  const prop = calculateProp(failedIndex, sequences);
  const count = sequences.length;
  const currentOrder = Math.min(failedIndex + 1, count);
  const last = failedIndex === count;
  process.stdout.write(
    figlet.textSync(`  ${currentOrder}${last ? "!" : ""}`, "Ghost")
  );
  process.stdout.write(`${currentOrder}/${sequences.length}·${prop}%\n`);
}

function padLeft(text, length) {
  text = `${text}`;
  while (text.length < length) {
    text = ` ${text}`;
  }
  return text;
}

function padRight(text, length) {
  text = `${text}`;
  while (text.length < length) {
    text += " ";
  }
  return text;
}

function calculateProp(failedIndex, sequences) {
  if (failedIndex === sequences.length) return 100;
  let prop = ((100 * failedIndex) / sequences.length).toFixed(0);
  if (prop === "100") prop = "99";
  return prop;
}
