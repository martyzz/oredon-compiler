const chai = require("chai");
const expect = chai.expect;
chai.should();

const determineTargets = require("../../src/compile/determineTargets").default;
const {
  exclusiveCellIndexAtPosition,
  getCursor,
  getVelocity,
  moveCursor,
  isOutOfBounds,
  getTarget,
  getDirectionSymbol
} = require("../../src/compile/determineTargets");
const types = require("../../src/compile/types");

describe("determineTargets()", () => {
  let mockCells;

  it("should determine a targets for movement types", () => {
    mockCells = [
      {
        characters: "[>]",
        dimension: {
          lineIndex: 0,
          charIndex: { from: 0, to: 2 },
          inlineIndex: 0
        },
        statements: [
          {
            type: "type/MOVEMENT",
            formated: ">",
            meta: {},
            exact: [">"]
          }
        ]
      },
      {
        characters: "[<]",
        dimension: {
          lineIndex: 0,
          charIndex: { from: 10, to: 12 },
          inlineIndex: 1
        },
        statements: [
          {
            type: "type/MOVEMENT",
            formated: "<",
            meta: {},
            exact: ["<"]
          }
        ]
      }
    ];
    const bounds = { lineIndex: 100, charIndex: 100 };
    determineTargets(mockCells, bounds);
    mockCells[0].statements[0].meta.targetIndex.should.be.equal(1);
    mockCells[1].statements[0].meta.targetIndex.should.be.equal(0);
  });

  it("should determine a target for condition type", () => {
    mockCells = [
      {
        characters: "[a<=n?>]",
        dimension: {
          lineIndex: 0,
          charIndex: { from: 0, to: 7 },
          inlineIndex: 0
        },
        statements: [
          {
            type: "type/CONDITION",
            formated: "a<=n?>",
            meta: {
              expression1: "a",
              comparisonOperator: "<=",
              expression2: "n",
              movementOperator: ">"
            },
            exact: ["a", "<", "=", "n", "?", ">"]
          }
        ]
      },
      {
        characters: "[a<=n?<]",
        dimension: {
          lineIndex: 0,
          charIndex: { from: 8, to: 15 },
          inlineIndex: 0
        },
        statements: [
          {
            type: "type/CONDITION",
            formated: "a<=n?<",
            meta: {
              expression1: "a",
              comparisonOperator: "<=",
              expression2: "n",
              movementOperator: "<"
            },
            exact: ["a", "<", "=", "n", "?", "<"]
          }
        ]
      }
    ];
    const bounds = { lineIndex: 100, charIndex: 100 };
    determineTargets(mockCells, bounds);
    mockCells[0].statements[0].meta.targetIndex.should.be.equal(1);
    mockCells[1].statements[0].meta.targetIndex.should.be.equal(0);
  });

  it("should throw an error when there is no target", () => {
    const mockCells = [
      {
        characters: "[>]",
        dimension: {
          lineIndex: 0,
          charIndex: { from: 0, to: 2 },
          inlineIndex: 0
        },
        statements: [
          {
            type: "type/MOVEMENT",
            formated: ">",
            meta: {},
            exact: [">"]
          }
        ]
      }
    ];
    const bounds = { lineIndex: 100, charIndex: 100 };
    expect(() => determineTargets(mockCells, bounds)).to.throw(Error);
  });

  describe("exclusiveCellIndexAtPosition()", () => {
    beforeEach(() => {
      mockCells = [
        { dimension: { lineIndex: 0, charIndex: { from: 0, to: 10 } } },
        { dimension: { lineIndex: 1, charIndex: { from: 8, to: 12 } } },
        { dimension: { lineIndex: 1, charIndex: { from: 13, to: 16 } } }
      ];
    });

    it("should return cell index at position", () => {
      const position = { lineIndex: 1, charIndex: 12 };
      const cellIndex = exclusiveCellIndexAtPosition(mockCells, position, -1);
      cellIndex.should.be.equal(1);
    });

    it("should return -1 if it doesnt find any cell at position", () => {
      const position = { lineIndex: 0, charIndex: 11 };
      const cellIndex = exclusiveCellIndexAtPosition(mockCells, position, -1);
      cellIndex.should.be.equal(-1);
    });

    it("should return -1 if the resulting index is same as exclusion index", () => {
      const position = { lineIndex: 1, charIndex: 12 };
      const cellIndex = exclusiveCellIndexAtPosition(mockCells, position, 1);
      cellIndex.should.be.equal(-1);
    });
  });

  describe("getCursor()", () => {
    let mockCell;

    beforeEach(() => {
      mockCell = {
        dimension: { lineIndex: 2, charIndex: { from: 5, to: 10 } },
        statements: [
          { exact: ["a", "b", "c"] },
          { exact: ["d", "e", "f"] },
          { exact: ["g", "h", ">"] }
        ]
      };
    });

    it("should compute correct position of the cursor", () => {
      const upToThisStatement = mockCell.statements[2];
      const cursor = getCursor(mockCell, upToThisStatement); // 16
      cursor.should.be.eql({
        lineIndex: 2,
        charIndex: 16
      });
    });
  });

  describe("getVelocity()", () => {
    it("should compute correct velocity for >", () => {
      getVelocity(">").should.be.eql({ charIndex: 1, lineIndex: 0 });
    });
    it("should compute correct velocity for <", () => {
      getVelocity("<").should.be.eql({ charIndex: -1, lineIndex: 0 });
    });
    it("should compute correct velocity for ^", () => {
      getVelocity("^").should.be.eql({ charIndex: 0, lineIndex: -1 });
    });
    it("should compute correct velocity for v", () => {
      getVelocity("v").should.be.eql({ charIndex: 0, lineIndex: 1 });
    });
  });

  describe("moveCursor()", () => {
    it("should move cursor accordingly", () => {
      const cursor = { charIndex: 10, lineIndex: 10 };
      const velocity = { charIndex: -1, lineIndex: 1 };
      moveCursor(cursor, velocity);
      cursor.should.be.eql({ charIndex: 9, lineIndex: 11 });
    });
  });

  describe("isOutOfBounds()", () => {
    it("should determine it is out", () => {
      const cursor = { charIndex: 16, lineIndex: 2 };
      const bounds = { charIndex: 15, lineIndex: 2 };
      const result = isOutOfBounds(cursor, bounds);
      result.should.be.true;
    });

    it("should determine it is in", () => {
      const cursor = { charIndex: 15, lineIndex: 2 };
      const bounds = { charIndex: 15, lineIndex: 2 };
      const result = isOutOfBounds(cursor, bounds);
      result.should.be.false;
    });
  });

  describe("getTarget()", () => {
    let mockCells;

    beforeEach(() => {
      mockCells = [
        { dimension: { lineIndex: 0, charIndex: { from: 0, to: 10 } } },
        { dimension: { lineIndex: 1, charIndex: { from: 8, to: 12 } } },
        { dimension: { lineIndex: 1, charIndex: { from: 13, to: 16 } } }
      ];
    });

    it("should return correct horizontal target index", () => {
      const currentCellIndex = 1;
      const cursor = { lineIndex: 1, charIndex: 10 };
      const velocity = { lineIndex: 0, charIndex: 1 }; // moving right
      const bounds = { lineIndex: 100, charIndex: 100 };
      const targetIndex = getTarget(
        mockCells,
        currentCellIndex,
        cursor,
        velocity,
        bounds
      );
      targetIndex.should.be.equal(2);
    });

    it("should return correct vertical target index", () => {
      const currentCellIndex = 1;
      const cursor = { lineIndex: 1, charIndex: 10 };
      const velocity = { lineIndex: -1, charIndex: 0 }; // moving up
      const bounds = { lineIndex: 100, charIndex: 100 };
      const targetIndex = getTarget(
        mockCells,
        currentCellIndex,
        cursor,
        velocity,
        bounds
      );
      targetIndex.should.be.equal(0);
    });
  });

  describe("getDirectionSymbol()", () => {
    it("should return correct direction symbol for movement statement", () => {
      const statement = { type: types.MOVEMENT_TYPE, formated: ">", meta: {} };
      const symbol = getDirectionSymbol(statement);
      symbol.should.equal(statement.formated);
    });

    it("should return correct direction symbol for condition statement", () => {
      const statement = {
        type: types.CONDITION_TYPE,
        meta: { movementOperator: "<" }
      };
      const symbol = getDirectionSymbol(statement);
      symbol.should.equal(statement.meta.movementOperator);
    });
  });
});
