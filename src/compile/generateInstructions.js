const {
  ENTRY_TYPE,
  INPUT_TYPE,
  OUTPUT_TYPE,
  MOVEMENT_TYPE,
  CONDITION_TYPE,
  ASSIGNMENT_TYPE
} = require("./types");

const {
  assembleEntryInstruction,
  assembleInputInstruction,
  assembleOutputInstruction,
  assembleMovementInstruction,
  assembleConditionInstruction,
  assembleAssignmentInstruction
} = require("./instructionAssemblers");

const assembleInstruction = statement => {
  switch (statement.type) {
    case ENTRY_TYPE:
      return assembleEntryInstruction(statement);
    case INPUT_TYPE:
      return assembleInputInstruction(statement);
    case OUTPUT_TYPE:
      return assembleOutputInstruction(statement);
    case MOVEMENT_TYPE:
      return assembleMovementInstruction(statement);
    case CONDITION_TYPE:
      return assembleConditionInstruction(statement);
    case ASSIGNMENT_TYPE:
      return assembleAssignmentInstruction(statement);
  }
};

const generateInstruction = (cellIndex, statementIndex, statement) => {
  return [cellIndex, statementIndex, ...assembleInstruction(statement)];
};

const stringifyInstructions = instructions => {
  return instructions.map(instruction => instruction.join(" ")).join("\n");
};

const generateInstructions = cells => {
  const instructions = [];

  cells.forEach((cell, cellIndex) => {
    cell.statements.forEach((statement, statementIndex) => {
      instructions.push(
        generateInstruction(cellIndex, statementIndex, statement)
      );
    });
  });

  return stringifyInstructions(instructions);
};

module.exports = {
  default: generateInstructions,
  assembleInstruction,
  generateInstruction,
  stringifyInstructions
};
