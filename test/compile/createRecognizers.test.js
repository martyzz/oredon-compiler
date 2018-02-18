const chai = require("chai");
chai.should();

const createRecognizers = require("../../src/compile/createRecognizers");
const types = require("../../src/compile/types");

describe("createRecognizers()", () => {
  let recognizers;

  before(() => {
    recognizers = createRecognizers();
  });

  it("should match entry", () => {
    const formated = "@";
    const { recognize } = recognizers.find(
      recognizer => recognizer.type === types.ENTRY_TYPE
    );
    const result = recognize(formated);
    result.recognized.should.be.true;
    result.meta.should.eql({});
  });

  it("should match input", () => {
    const formated = "\\azAZ";
    const { recognize } = recognizers.find(
      recognizer => recognizer.type === types.INPUT_TYPE
    );
    const result = recognize(formated);
    result.recognized.should.be.true;
    result.meta.should.eql({ variable: "azAZ" });
  });

  it("should match output", () => {
    const formated = "/expressionAZ+5-sin(3)^5";
    const { recognize } = recognizers.find(
      recognizer => recognizer.type === types.OUTPUT_TYPE
    );
    const result = recognize(formated);
    result.recognized.should.be.true;
    result.meta.should.eql({ expression: "expressionAZ+5-sin(3)^5" });
  });

  it("should match movement", () => {
    const formated = "^";
    const { recognize } = recognizers.find(
      recognizer => recognizer.type === types.MOVEMENT_TYPE
    );
    const result = recognize(formated);
    result.recognized.should.be.true;
    result.meta.should.eql({});
  });

  it("should match condition", () => {
    const formated = "a+Ca-cos(5)!=d+b-sin(TEST)?v";
    const { recognize } = recognizers.find(
      recognizer => recognizer.type === types.CONDITION_TYPE
    );
    const result = recognize(formated);
    result.recognized.should.be.true;
    result.meta.should.eql({
      expression1: "a+Ca-cos(5)",
      comparisonOperator: "!=",
      expression2: "d+b-sin(TEST)",
      movementOperator: "v"
    });
  });

  it("should match assignment", () => {
    const formated = "testAZ=15+sin(TEST)-(5^2)";
    const { recognize } = recognizers.find(
      recognizer => recognizer.type === types.ASSIGNMENT_TYPE
    );
    const result = recognize(formated);
    result.recognized.should.be.true;
    result.meta.should.eql({
      variable: "testAZ",
      expression: "15+sin(TEST)-(5^2)"
    });
  });

  it("should match unrecognized", () => {
    const formated = "statement";
    const { recognize } = recognizers.find(
      recognizer => recognizer.type === types.UNRECOGNIZED_TYPE
    );
    const result = recognize(formated);
    result.recognized.should.be.true;
    result.meta.should.eql({});
  });
});
