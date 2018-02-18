const createMatchers = require("./createMatchers");
const {
  ENTRY_TYPE,
  INPUT_TYPE,
  OUTPUT_TYPE,
  MOVEMENT_TYPE,
  CONDITION_TYPE,
  ASSIGNMENT_TYPE,
  UNRECOGNIZED_TYPE
} = require("./types");

const createEntryRecognizer = matcher => {
  return formated => {
    const result = formated.match(matcher);
    if (result) return { recognized: true, meta: {} };
    return { recognized: false };
  };
};

const createInputRecognizer = matcher => {
  return formated => {
    const result = formated.match(matcher);
    if (result)
      return {
        recognized: true,
        meta: {
          variable: result[1]
        }
      };
    return { recognized: false };
  };
};

const createOutputRecognizer = matcher => {
  return formated => {
    const result = formated.match(matcher);
    if (result)
      return {
        recognized: true,
        meta: {
          expression: result[1]
        }
      };
    return { recognized: false };
  };
};

const createMovementRecognizer = matcher => {
  return formated => {
    const result = formated.match(matcher);
    if (result) return { recognized: true, meta: {} };
    return { recognized: false };
  };
};

const createAssignmentRecognizer = matcher => {
  return formated => {
    const result = formated.match(matcher);
    if (result)
      return {
        recognized: true,
        meta: {
          variable: result[1],
          expression: result[2]
        }
      };
    return { recognized: false };
  };
};

const createConditionRecognizer = matcher => {
  return formated => {
    const result = formated.match(matcher);
    if (result)
      return {
        recognized: true,
        meta: {
          expression1: result[1],
          comparisonOperator: result[2],
          expression2: result[3],
          movementOperator: result[4]
        }
      };
    return { recognized: false };
  };
};

const createUnrecognizedRecognizer = () => {
  return formated => ({ recognized: true, meta: {} });
};

const createRecognizers = () => {
  const {
    entry,
    input,
    output,
    movement,
    assignment,
    condition
  } = createMatchers();

  return [
    {
      type: ENTRY_TYPE,
      recognize: createEntryRecognizer(entry)
    },
    {
      type: INPUT_TYPE,
      recognize: createInputRecognizer(input)
    },
    {
      type: OUTPUT_TYPE,
      recognize: createOutputRecognizer(output)
    },
    {
      type: MOVEMENT_TYPE,
      recognize: createMovementRecognizer(movement)
    },
    {
      type: ASSIGNMENT_TYPE,
      recognize: createAssignmentRecognizer(assignment)
    },
    {
      type: CONDITION_TYPE,
      recognize: createConditionRecognizer(condition)
    },
    {
      type: UNRECOGNIZED_TYPE,
      recognize: createUnrecognizedRecognizer()
    }
  ];
};

module.exports = createRecognizers;
