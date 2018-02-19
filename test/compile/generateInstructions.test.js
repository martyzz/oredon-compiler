const chai = require("chai");
chai.should();
const expect = chai.expect;

const generateInstructions = require("../../src/compile/generateInstructions")
  .default;
const {
  assembleInstruction,
  generateInstruction,
  stringifyInstructions
} = require("../../src/compile/generateInstructions");
const types = require("../../src/compile/types");

describe("generateInstructions()", () => {

  it("should correctly generate instructions from cells", () => {
    const mockCells = [
      {
        statements: [
          { type: types.ENTRY_TYPE },
          {
            type: types.CONDITION_TYPE,
            meta: {
              expression1: "a",
              expression2: "b",
              comparisonOperator: "!=",
              targetIndex: "1"
            }
          }
        ]
      },
      {
        statements: [
          {
            type: types.ASSIGNMENT_TYPE,
            meta: { variable: "a", expression: "a+1" }
          },
          {
            type: types.CONDITION_TYPE,
            meta: {
              expression1: "b",
              expression2: "a",
              comparisonOperator: "!=",
              targetIndex: "0"
            }
          }
        ]
      }
    ];

    const mockEntry = { cellIndex: 2, statementIndex: 5 };
    const result = generateInstructions(mockCells, mockEntry);
    const expected = `0 0 e\n0 1 c a b 5 1\n1 0 a a a+1\n1 1 c b a 5 0`;
    result.should.be.equal(expected);
  });

  describe("stringifyInstructions()", () => {
    it("should correctly stringify instructions", () => {
      const instructions = [["a", "b", "c"], ["d", "e", "f"]];
      const expected = `a b c\nd e f`;
      const result = stringifyInstructions(instructions);
      result.should.be.equal(expected);
    });
  });

  describe("assembleInstruction()", () => {
    it("should correctly asseble sample instruction", () => {
      const statement = {
        type: types.CONDITION_TYPE, // more types tested in instructionAssemblers.test.js
        meta: {
          expression1: "a",
          expression2: "b",
          comparisonOperator: "!=",
          targetIndex: "index"
        }
      };
      const result = assembleInstruction(statement);
      result.should.be.eql(["c", "a", "b", 5, "index"]);
    });
  });

  describe("generateInstruction()", () => {
    it("should correctly generate instruction", () => {
      const statement = {
        type: types.CONDITION_TYPE,
        meta: {
          expression1: "a",
          expression2: "b",
          comparisonOperator: "!=",
          targetIndex: "index"
        }
      };
      const result = generateInstruction(5, 6, statement);
      result.should.be.eql([5, 6, "c", "a", "b", 5, "index"]);
    });
  });
});
