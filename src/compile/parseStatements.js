const { emptyStatementError } = require("../errors/parsingErrors");

// creates statement from characters array
const createStatement = characters => {
  return {
    exact: characters,
    formated: characters
      .filter(char => char.length > 0 && char !== " ")
      .join("")
  };
};

// setup a function that checks for an invalid statement
const verifyStatements = ({
  statements,
  dimension: { lineIndex, inlineIndex }
}) => {
  statements.forEach(({ formated: { length } }, statementIndex) => {
    if (length === 0)
      throw emptyStatementError(lineIndex, inlineIndex, statementIndex);
  });
};

const parseStatements = (cells, config) => {
  // const setup a function that checks if character is a separator
  const isSeparatorChar = char => char === config.statementSeparator;

  cells.forEach(cell => {
    const statements = [];
    let statementChars = [];

    // loop over cell characters omiting first and last
    for (let i = 1; i < cell.characters.length - 1; i++) {
      const char = cell.characters.charAt(i);

      if (isSeparatorChar(char)) {
        statements.push(createStatement(statementChars));
        statementChars = [];
        continue;
      }

      statementChars.push(char);
    }

    statements.push(createStatement(statementChars));
    cell.statements = statements;
    verifyStatements(cell);
  });
};

module.exports = {
  default: parseStatements,
  createStatement,
  verifyStatements
};
