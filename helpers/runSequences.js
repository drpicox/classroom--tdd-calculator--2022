import chalk from "chalk";
import figlet from "figlet";
import { toSatisfy } from "./toSatisfy";
expect.extend({ toSatisfy });

export function runSequences(sequences, Calculator) {
  const [failedIndex, error] = findFailingSequence(sequences, Calculator);

  writeProgressNumber(sequences, failedIndex);
  writeSequencesSteps(sequences, failedIndex);
  process.stdout.write("\n");
  writeStatus(sequences, failedIndex, error);

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

  if (!process.env.CI) throw error;
  console.error(error.stack);
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

function writeStatus(sequences, failedIndex, error) {
  if (!error) writeStatusPass();
  else writeStatusFail(sequences, failedIndex, error);
}

function writeStatusPass() {
  process.stdout.write(
    `${chalk.green.bold.inverse(" 100% ")} All examples passed successfully.\n`
  );
}

function writeStatusFail(sequences, failedIndex, error) {
  const prop = calculateProp(failedIndex, sequences);
  const message = error.message.split("\n")[0];

  const sequence = sequences[failedIndex];
  const order = failedIndex + 1;
  const sequenceIndex = error.sequenceIndex || 0;
  const passedSequence = chalk.green(`"${sequence.slice(0, sequenceIndex)}`);
  const failedSequence = chalk.red.bold(`${sequence[sequenceIndex]}`);
  const unknownSequence = chalk.gray(`${sequence.slice(sequenceIndex + 1)}"`);

  process.stdout.write(padLeft("v\n", sequenceIndex + 15));
  process.stdout.write(
    `${chalk.bold.yellow.inverse(` ${padLeft(prop, 3)}% `)} ${padLeft(
      order,
      3
    )}: ${passedSequence}${failedSequence}${unknownSequence}: ${chalk.red(
      message
    )}\n`
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

function writeProgressNumber(sequences, failedIndex) {
  const prop = calculateProp(failedIndex, sequences);
  const count = sequences.length;
  const last = failedIndex === count;
  const color = (last ? chalk.green : chalk.yellow).inverse.bold;

  process.stdout.write(
    color(`    ~~ ${failedIndex}/${sequences.length} · ${prop}% ~~    \n`)
  );
  process.stdout.write(
    figlet.textSync(`  ${failedIndex}${last ? "!" : ""}`, "Ghost")
  );
  process.stdout.write("\n\n");
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
