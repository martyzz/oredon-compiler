const chai = require("chai");
chai.should();
const expect = chai.expect;

const parseStatements = require("../../src/compile/parseStatements").default;
const {
  createStatement,
  verifyStatements
} = require("../../src/compile/parseStatements");

describe("parseStatements()", () => {
  it("should correctly parse statements", () => {
    const config = {
      statementSeparator: ";"
    };
    const cells = [
      {
        characters: "[a < 5?>;a = 5]",
        dimension: { lineIndex: 0, inlineIndex: 1 }
      },
      {
        characters: "[^]",
        dimension: { lineIndex: 1, inlineIndex: 2 }
      }
    ];

    const expectedCells = [
      {
        characters: "[a < 5?>;a = 5]",
        dimension: { lineIndex: 0, inlineIndex: 1 },
        statements: [
          {
            exact: ["a", " ", "<", " ", "5", "?", ">"],
            formated: "a<5?>"
          },
          {
            exact: ["a", " ", "=", " ", "5"],
            formated: "a=5"
          }
        ]
      },
      {
        characters: "[^]",
        dimension: { lineIndex: 1, inlineIndex: 2 },
        statements: [
          {
            exact: ["^"],
            formated: "^"
          }
        ]
      }
    ];

    parseStatements(cells, config);
    cells.should.deep.equal(expectedCells);
  });

  describe("verifyStatements()", () => {
    it("should not throw when all statements are valid", () => {
      const cell = {
        statements: [{ formated: "full" }, { formated: "full" }],
        dimension: { lineIndex: 0, inlineIndex: 0 }
      };
      expect(() => verifyStatements(cell)).not.to.throw(Error);
    });

    it("should throw when statement is empty", () => {
      const cell = {
        statements: [{ formated: "full" }, { formated: "" }],
        dimension: { lineIndex: 0, inlineIndex: 0 }
      };
      expect(() => verifyStatements(cell)).to.throw(Error);
    });
  });

  describe("createStatement()", () => {
    it("should create statement from characters", () => {
      const characters = ["t", "e", "s", "t"];
      const result = createStatement(characters);
      result.should.be.deep.equal({ exact: characters, formated: "test" });
    });
  });
});
