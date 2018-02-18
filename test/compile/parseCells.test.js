const chai = require("chai");
const expect = chai.expect;
chai.should();

const parseCells = require("../../src/compile/parseCells").default;
const { createCellFactory, getLines } = require("../../src/compile/parseCells");

describe("parseCells()", () => {
  it("should correctly parse script into cells", () => {
    const script = `[@;v]\n[a=5;>] [/a]`;
    const expectedCells = [
      {
        characters: "[@;v]",
        dimension: {
          lineIndex: 0,
          charIndex: {
            from: 0,
            to: 4
          },
          inlineIndex: 0
        }
      },
      {
        characters: "[a=5;>]",
        dimension: {
          lineIndex: 1,
          charIndex: {
            from: 0,
            to: 6
          },
          inlineIndex: 0
        }
      },
      {
        characters: "[/a]",
        dimension: {
          lineIndex: 1,
          charIndex: {
            from: 8,
            to: 11
          },
          inlineIndex: 1
        }
      }
    ];

    const cells = [];
    const bounds = { lineIndex: 0, charIndex: 0 };
    const config = { cellOpening: "[", cellClosing: "]" };

    parseCells(cells, bounds, script, config);

    cells.should.deep.equal(expectedCells);
  });

  it("should result in correct bounds", () => {
    const script = `[@;v]\n[a=5;>] [/a]`;
    const expectedBounds = { lineIndex: 1, charIndex: 11 };

    const cells = [];
    const bounds = { lineIndex: 0, charIndex: 0 };
    const config = { cellOpening: "[", cellClosing: "]" };

    parseCells(cells, bounds, script, config);

    bounds.should.deep.equal(expectedBounds);
  });

  describe("throws", () => {
    let cells;
    let bounds;
    let config;

    beforeEach(() => {
      cells = [];
      bounds = { lineIndex: 0, charIndex: 0 };
      config = { cellOpening: "[", cellClosing: "]" };
    });

    it("should throw duplicate cell opening", () => {
      const script = `[[@;v]\n[a=5;>] [/a]`;
      expect(() => parseCells(cells, bounds, script, config)).to.throw(Error);
    });
    it("should throw closing without opening", () => {
      const script = `@;v]\n[a=5;>] [/a]`;
      expect(() => parseCells(cells, bounds, script, config)).to.throw(Error);
    });
    it("should throw missing cell closing", () => {
      const script = `[@;v]]\n[a=5;>] [/a]`;
      expect(() => parseCells(cells, bounds, script, config)).to.throw(Error);
    });
  });

  describe("createCellFactory()", () => {
    let cellFactory;

    beforeEach(() => {
      cellFactory = createCellFactory();
    });
    it("should return resulting cell", () => {
      cellFactory.result().should.not.be.undefined;
    });

    it("should set line index", () => {
      cellFactory.setLineIndex("test");
      cellFactory.result().dimension.lineIndex.should.be.equal("test");
    });

    it("should set char index from", () => {
      cellFactory.setCharIndexFrom("test");
      cellFactory.result().dimension.charIndex.from.should.be.equal("test");
    });

    it("should set char index to", () => {
      cellFactory.setCharIndexTo("test");
      cellFactory.result().dimension.charIndex.to.should.be.equal("test");
    });

    it("should set char inline index", () => {
      cellFactory.setInlineIndex("test");
      cellFactory.result().dimension.inlineIndex.should.be.equal("test");
    });

    it("should push char", () => {
      cellFactory.pushChar("t");
      cellFactory.pushChar("e");
      cellFactory.pushChar("s");
      cellFactory.pushChar("t");
      cellFactory.result().characters.should.be.equal("test");
    });
  });

  describe("getLines()", () => {
    it("should correctly separate script to lines", () => {
      const script = `[>]\n[<]`;
      const result = getLines(script);
      result.should.be.eql(["[>]", "[<]"]);
    });
  });
});
