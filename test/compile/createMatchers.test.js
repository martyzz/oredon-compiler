const chai = require("chai");
chai.should();

const createMatchers = require("../../src/compile/createMatchers");

describe("createMatchers()", () => {
  let matchers;

  before(() => {
    matchers = createMatchers();
  });
  it("should test entry", () => {
    const formated = "@";
    const result = matchers.entry.test(formated);
    result.should.be.true;
  });

  it("should test input", () => {
    const formated = "\\azAZ";
    const result = matchers.input.test(formated);
    result.should.be.true;
  });

  it("should test output", () => {
    const formated = "/expressionAZ+5-sin(3)^5";
    const result = matchers.output.test(formated);
    result.should.be.true;
  });

  it("should test movement", () => {
    const formated = "^";
    const result = matchers.movement.test(formated);
    result.should.be.true;
  });

  it("should test condition", () => {
    const formated = "a+Ca-cos(5)!=d+b-sin(TEST)?v";
    const result = matchers.condition.test(formated);
    result.should.be.true;
  });

  it("should test assignment", () => {
    const formated = "testAZ=15+sin(TEST)-(5^2)";
    const result = matchers.assignment.test(formated);
    result.should.be.true;
  });
});
