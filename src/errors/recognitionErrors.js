const HEADER = "Recognition error:\n";

const unrecognizedStatementError = (
  lineIndex,
  inlineIndex,
  statementIndex,
  statementText
) => {
  return new Error(
    `${HEADER} Statement "${statementText}" was not recognized with any type at (line: ${lineIndex +
      1}, cell: ${inlineIndex + 1}, statement: ${statementIndex + 1})`
  );
};

const entryPointsIncorrectCountError = count => {
  return new Error(
    `${HEADER} Recognized incorrect count of "@" entry points (expected: 1 found: ${count})`
  );
};

module.exports = {
  unrecognizedStatementError,
  entryPointsIncorrectCountError
};
