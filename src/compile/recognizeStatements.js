const createRecognizers = require("./createRecognizers");
const {
  unrecognizedStatementError,
  entryPointsIncorrectCountError
} = require("../errors/recognitionErrors");
const { ENTRY_TYPE, UNRECOGNIZED_TYPE } = require("./types");

const recognizeStatements = cells => {
  const recognizers = createRecognizers();
  let entryPointsCount = 0;

  cells.forEach((cell, cellIndex) => {
    cell.statements = cell.statements.map(
      ({ exact, formated }, statementIndex) => {
        for (let recognizer of recognizers) {
          const { recognize, type } = recognizer;
          const { recognized, meta } = recognize(formated);

          if (recognized) {
            if (type === UNRECOGNIZED_TYPE) {
              const { dimension: { lineIndex, inlineIndex } } = cell;
              throw unrecognizedStatementError(
                lineIndex,
                inlineIndex,
                statementIndex,
                formated
              );
            }

            if (type === ENTRY_TYPE) {
              entryPointsCount++;
            }

            return { type, formated, meta, exact };
          }
        }
      }
    );
  });

  if (entryPointsCount != 1) {
    throw entryPointsIncorrectCountError(entryPointsCount);
  }
};

module.exports = { default: recognizeStatements };
