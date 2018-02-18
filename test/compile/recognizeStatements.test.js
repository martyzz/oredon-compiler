const chai = require("chai");
chai.should();
const expect = chai.expect;

const recognizeStatements = require("../../src/compile/recognizeStatements")
  .default;
const types = require("../../src/compile/types");

describe("recognizeStatements()", () => {
  it("should correctly recognize statements", () => {
    const cells = [
      {
        statements: [
          {
            formated: "@",
            exact: ["@"]
          },
          {
            formated: "\\a",
            exact: ["\\", "a"]
          },
          {
            formated: "/a",
            exact: ["/", "a"]
          },
          {
            formated: "a<b?>",
            exact: ["a", "<", "b", "?", ">"]
          },
          {
            formated: "a=5",
            exact: ["a", "=", "5"]
          },
          {
            formated: ">",
            exact: [">"]
          }
        ]
      }
    ];

    const expectedCells = [
      {
        statements: [
          {
            type: types.ENTRY_TYPE,
            formated: "@",
            meta: {},
            exact: ["@"]
          },
          {
            type: types.INPUT_TYPE,
            formated: "\\a",
            meta: {
              variable: "a"
            },
            exact: ["\\", "a"]
          },
          {
            type: types.OUTPUT_TYPE,
            formated: "/a",
            meta: {
              expression: "a"
            },
            exact: ["/", "a"]
          },
          {
            type: types.CONDITION_TYPE,
            formated: "a<b?>",
            meta: {
              expression1: "a",
              comparisonOperator: "<",
              expression2: "b",
              movementOperator: ">"
            },
            exact: ["a", "<", "b", "?", ">"]
          },
          {
            type: types.ASSIGNMENT_TYPE,
            formated: "a=5",
            meta: {
              variable: "a",
              expression: "5"
            },
            exact: ["a", "=", "5"]
          },
          {
            type: types.MOVEMENT_TYPE,
            formated: ">",
            meta: {},
            exact: [">"]
          }
        ]
      }
    ];

    const entry = {};
    recognizeStatements(cells, entry);
    cells.should.be.deep.equal(expectedCells);
  });

  it("should correctly assign entry point", () => {
    const cells = [
      {
        statements: [
          {
            formated: ">",
            exact: [">"]
          },
          {
            formated: "@",
            exact: ["@"]
          }
        ]
      }
    ];

    const entry = {};
    recognizeStatements(cells, entry);
    entry.should.deep.equal({ cellIndex: 0, statementIndex: 1 });
  });

  describe("throws", () => {
    it("should throw on unrecognized statement", () => {
      const cells = [
        {
          statements: [
            {
              formated: "@",
              exact: ["@"]
            },
            {
              formated: "test",
              exact: ["t", "e", "s", "t"]
            }
          ]
        }
      ];

      const entry = {};
      expect(() => recognizeStatements(cells, entry)).to.throw(Error);
    });
    it("should throw no no entry points", () => {
      const cells = [
        {
          statements: [
            {
              formated: "a=5",
              exact: ["a", "=", "5"]
            }
          ]
        }
      ];

      const entry = {};
      expect(() => recognizeStatements(cells, entry)).to.throw(Error);
    });
    it("should throw on more then one entry points", () => {
      const cells = [
        {
          statements: [
            {
              formated: "@",
              exact: ["@"]
            },
            {
              formated: "@",
              exact: ["@"]
            }
          ]
        }
      ];

      const entry = {};
      expect(() => recognizeStatements(cells, entry)).to.throw(Error);
    });
  });
});
