const numerifyComparsionOperator = operator => {
  switch (operator) {
    case "<":
      return 0;
    case ">":
      return 1;
    case "<=":
      return 2;
    case ">=":
      return 3;
    case "==":
      return 4;
    case "!=":
      return 5;
  }
};

const assembleEntryInstruction = statement => {
  return ["e"];
};

const assembleInputInstruction = ({ meta: { variable } }) => {
  return ["i", variable];
};

const assembleOutputInstruction = ({ meta: { expression } }) => {
  return ["o", expression];
};

const assembleMovementInstruction = ({ meta: { targetIndex } }) => {
  return ["m", targetIndex];
};

const assembleConditionInstruction = ({
  meta: { expression1, comparisonOperator, expression2, targetIndex }
}) => {
  return [
    "c",
    expression1,
    expression2,
    numerifyComparsionOperator(comparisonOperator),
    targetIndex
  ];
};

const assembleAssignmentInstruction = ({ meta: { variable, expression } }) => {
  return ["a", variable, expression];
};

module.exports = {
  assembleEntryInstruction,
  assembleInputInstruction,
  assembleOutputInstruction,
  assembleMovementInstruction,
  assembleConditionInstruction,
  assembleAssignmentInstruction,
  numerifyComparsionOperator
};
