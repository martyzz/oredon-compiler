const HEADER = "Movement error:\n";

const targetNotFoundError = (
  lineIndex,
  inlineIndex,
  statementIndex,
  statementText
) => {
  return new Error(
    `${HEADER} Movement operator "${statementText}" is pointing to infinity at (line: ${lineIndex +
      1}, cell: ${inlineIndex + 1}, statement: ${statementIndex + 1})`
  );
};

module.exports = {
  targetNotFoundError
};
