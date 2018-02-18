const { MOVEMENT_TYPE, CONDITION_TYPE } = require("./types");
const { targetNotFoundError } = require("../errors/movementErrors");

const exclusiveCellIndexAtPosition = (cells, position, exclusionIndex) => {
  let index = -1;

  cells.forEach(
    ({ dimension: { lineIndex, charIndex: { from, to } } }, cellIndex) => {
      if (
        position.lineIndex === lineIndex &&
        (position.charIndex >= from && position.charIndex <= to)
      ) {
        index = cellIndex;
      }
    }
  );

  return index === exclusionIndex ? -1 : index;
};

const getCursor = (
  {
    dimension: { lineIndex, charIndex: { from, to } },
    statements: cellStatements
  },
  targetStatement
) => {
  const cursor = { lineIndex, charIndex: from };

  // add exact length for each statement up to target statement
  for (let statement of cellStatements) {
    cursor.charIndex += statement.exact.length;
    if (statement === targetStatement) continue;
  }

  // add one for every separator
  cursor.charIndex += cellStatements.length - 1;
  return cursor;
};

const getVelocity = movement => {
  const velocity = { charIndex: 0, lineIndex: 0 };
  switch (movement) {
    case ">":
      velocity.charIndex = 1;
      break;
    case "<":
      velocity.charIndex = -1;
      break;
    case "^":
      velocity.lineIndex = -1;
      break;
    case "v":
      velocity.lineIndex = 1;
      break;
  }
  return velocity;
};

const moveCursor = (cursor, velocity) => {
  cursor.charIndex += velocity.charIndex;
  cursor.lineIndex += velocity.lineIndex;
};

const isOutOfBounds = (cursor, bounds) =>
  cursor.charIndex < 0 ||
  cursor.charIndex > bounds.charIndex ||
  cursor.lineIndex < 0 ||
  cursor.lineIndex > bounds.lineIndex;

const getTarget = (cells, cellIndex, cursor, velocity, bounds) => {
  let index;

  do {
    moveCursor(cursor, velocity);
    index = exclusiveCellIndexAtPosition(cells, cursor, cellIndex);
    if (isOutOfBounds(cursor, bounds)) return -1;
  } while (index === -1);

  return index;
};

const getDirectionSymbol = ({ type, meta: { movementOperator }, formated }) => {
  let direction = null;
  if (type === MOVEMENT_TYPE) direction = formated;
  else if (type === CONDITION_TYPE) direction = movementOperator;
  return direction;
};

const determineTargets = (cells, bounds) => {
  cells.forEach((cell, cellIndex) => {
    cell.statements.forEach((statement, statementIndex) => {
      if (
        statement.type === MOVEMENT_TYPE ||
        statement.type === CONDITION_TYPE
      ) {
        const directionSymbol = getDirectionSymbol(statement);
        const velocity = getVelocity(directionSymbol);
        const cursor = getCursor(cell, statement);
        const index = getTarget(cells, cellIndex, cursor, velocity, bounds);

        if (index === -1) {
          const { dimension: { lineIndex, inlineIndex } } = cell;
          throw targetNotFoundError(
            lineIndex,
            inlineIndex,
            statementIndex,
            directionSymbol
          );
        }

        statement.meta.targetIndex = index;
      }
    });
  });
};

module.exports = {
  default: determineTargets,
  exclusiveCellIndexAtPosition,
  getCursor,
  getVelocity,
  moveCursor,
  isOutOfBounds,
  getTarget,
  getDirectionSymbol
};
