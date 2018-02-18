const chai = require("chai");
chai.should();
const expect = chai.expect;

const {
  assembleEntryInstruction,
  assembleInputInstruction,
  assembleOutputInstruction,
  assembleMovementInstruction,
  assembleConditionInstruction,
  assembleAssignmentInstruction,
  numerifyComparsionOperator
} = require("../../src/compile/instructionAssemblers");
const types = require("../../src/compile/types");

describe("assemble<Type>Instruction()", () => {
  it("should assemble instruction for Entry type", () => {
    const statement = { type: types.ENTRY_TYPE };
    const result = assembleEntryInstruction(statement);
    result.should.be.eql(["e"]);
  });

  it("should assemble instruction for Input type", () => {
    const statement = {
      type: types.INPUT_TYPE,
      meta: { variable: "variable" }
    };
    const result = assembleInputInstruction(statement);
    result.should.be.eql(["i", "variable"]);
  });

  it("should assemble instruction for Output type", () => {
    const statement = {
      type: types.OUTPUT_TYPE,
      meta: { expression: "expression" }
    };
    const result = assembleOutputInstruction(statement);
    result.should.be.eql(["o", "expression"]);
  });

  it("should assemble instruction for Movement type", () => {
    const statement = {
      type: types.MOVEMENT_TYPE,
      meta: { targetIndex: "index" }
    };
    const result = assembleMovementInstruction(statement);
    result.should.be.eql(["m", "index"]);
  });

  it("should assemble instruction for Condition type", () => {
    const statement = {
      type: types.CONDITION_TYPE,
      meta: {
        expression1: "expression1",
        expression2: "expression2",
        comparisonOperator: "!=",
        targetIndex: "index"
      }
    };
    const result = assembleConditionInstruction(statement);
    result.should.be.eql(["c", "expression1", "expression2", 5, "index"]);
  });

  it("should assemble instruction for Assignment type", () => {
    const statement = {
      type: types.ASSIGNMENT_TYPE,
      meta: {
        variable: "variable",
        expression: "expression"
      }
    };
    const result = assembleAssignmentInstruction(statement);
    result.should.be.eql(["a", "variable", "expression"]);
  });

  describe("numerifyComparsionOperator()", () => {
    it("should correctly numerify < operator", () => {
      numerifyComparsionOperator("<").should.be.equal(0);
    });
    it("should correctly numerify > operator", () => {
      numerifyComparsionOperator(">").should.be.equal(1);
    });
    it("should correctly numerify <= operator", () => {
      numerifyComparsionOperator("<=").should.be.equal(2);
    });
    it("should correctly numerify >= operator", () => {
      numerifyComparsionOperator(">=").should.be.equal(3);
    });
    it("should correctly numerify == operator", () => {
      numerifyComparsionOperator("==").should.be.equal(4);
    });
    it("should correctly numerify != operator", () => {
      numerifyComparsionOperator("!=").should.be.equal(5);
    });
  });
});
