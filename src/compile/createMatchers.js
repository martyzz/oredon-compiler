const createMatchers = () => {
  const { source: variable } = /([a-zA-Z]+)/;
  const { source: expression } = /([a-zA-Z0-9.+\-*/()^]+)/;
  const { source: conditionOperator } = /(<|>|<=|>=|==|!=)/;
  const { source: movementOperator } = /(<|>|\^|v)/;
  const { source: begin } = /^/;
  const { source: end } = /$/;

  const { source: forwardSlash } = /\//;
  const { source: backwardSlash } = /\\/;
  const { source: equalSign } = /=/;
  const { source: atSymbol } = /@/;
  const { source: questionMark } = /\?/;

  return {
    entry: new RegExp(begin + atSymbol + end),
    input: new RegExp(begin + backwardSlash + variable + end),
    output: new RegExp(begin + forwardSlash + expression + end),
    movement: new RegExp(begin + movementOperator + end),
    assignment: new RegExp(begin + variable + equalSign + expression + end),
    condition: new RegExp(
      begin +
        expression +
        conditionOperator +
        expression +
        questionMark +
        movementOperator +
        end
    )
  };
};

module.exports = createMatchers;
