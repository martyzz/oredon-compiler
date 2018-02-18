const HEADER = "Parsing error:\n";

const duplicateCellOpeningError = (lineIndex, charIndex) => {
  return new Error(
    `${HEADER} Duplicate cell opening at (line: ${lineIndex +
      1}, character: ${charIndex + 1})`
  );
};

const closingCellWithoutOpeningError = (lineIndex, charIndex) => {
  return new Error(
    `${HEADER} Closing cell without opening at (line: ${lineIndex +
      1}, character: ${charIndex + 1})`
  );
};

const missingCellClosingError = lineIndex => {
  return new Error(
    `${HEADER} Missing cell closing at (line: ${lineIndex +
      1}, character: last)`
  );
};

const emptyStatementError = (lineIndex, inlineIndex, statementIndex) => {
  return new Error(
    `${HEADER} Empty statement at (line: ${lineIndex + 1}, cell: ${inlineIndex +
      1}, statement: ${statementIndex + 1})`
  );
};

module.exports = {
  duplicateCellOpeningError,
  closingCellWithoutOpeningError,
  missingCellClosingError,
  emptyStatementError
};
