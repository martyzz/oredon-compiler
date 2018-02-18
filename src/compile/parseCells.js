const {
  duplicateCellOpeningError,
  closingCellWithoutOpeningError,
  missingCellClosingError
} = require("../errors/parsingErrors");

const createCellFactory = () => {
  const cell = {
    characters: "",
    dimension: {
      lineIndex: null,
      charIndex: {
        from: null,
        to: null
      },
      inlineIndex: null
    }
  };

  return {
    setLineIndex: lineIndex => (cell.dimension.lineIndex = lineIndex),
    setCharIndexFrom: fromIndex => (cell.dimension.charIndex.from = fromIndex),
    setCharIndexTo: toIndex => (cell.dimension.charIndex.to = toIndex),
    setInlineIndex: inlineIndex => (cell.dimension.inlineIndex = inlineIndex),
    pushChar: char => (cell.characters += char),
    result: () => cell
  };
};

const getLines = script => script.match(/[^\r\n]+/g);

const parseCells = (cells, bounds, script, config) => {
  const lines = getLines(script);

  // set line index of bounds
  bounds.lineIndex = lines.length - 1;

  // create cell closing and opening character matchers
  const { cellOpening, cellClosing } = config;
  const isOpeningChar = char => char === cellOpening;
  const isClosingChar = char => char === cellClosing;

  // make cells
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    let inlineIndex = 0;
    let cellFactory = null;

    for (let charIndex = 0; charIndex < line.length; charIndex++) {
      const char = line.charAt(charIndex);

      // set max character index if is bigger than currently stored
      bounds.charIndex = Math.max(bounds.charIndex, charIndex);

      // create cell factory on opening character
      if (isOpeningChar(char)) {
        if (cellFactory) throw duplicateCellOpeningError(lineIndex, charIndex);
        cellFactory = createCellFactory();
        cellFactory.setLineIndex(lineIndex);
        cellFactory.setCharIndexFrom(charIndex);
        cellFactory.setInlineIndex(inlineIndex++);
      }

      // push characters in between
      if (cellFactory) cellFactory.pushChar(char);

      // close and push result of closing character
      if (isClosingChar(char)) {
        if (!cellFactory)
          throw closingCellWithoutOpeningError(lineIndex, charIndex);
        cellFactory.setCharIndexTo(charIndex);
        cells.push(cellFactory.result());
        cellFactory = null;
      }
    }

    if (cellFactory) throw missingCellClosingError(lineIndex);
  }
};

module.exports = {
  default: parseCells,
  createCellFactory,
  getLines
};
