const parseCells = require("./parseCells").default;
const parseStatements = require("./parseStatements").default;
const recognizeStatements = require("./recognizeStatements").default;
const determineTargets = require("./determineTargets").default;
const generateInstructions = require("./generateInstructions").default;

const defaultConfig = {
  cellOpening: "[",
  cellClosing: "]",
  statementSeparator: ";"
};

const compile = (script, additionalConfig = {}) => {
  const cells = [];
  const entry = { cellIndex: 0, statementIndex: 0 };
  const bounds = { charIndex: 0, lineIndex: 0 };
  const config = { ...defaultConfig, ...additionalConfig };

  parseCells(cells, bounds, script, config);
  parseStatements(cells, config);
  recognizeStatements(cells, entry);
  determineTargets(cells, bounds);
  const instructions = generateInstructions(cells, entry);

  return instructions;
};

module.exports = compile;
