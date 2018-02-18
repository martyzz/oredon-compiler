const HEADER = "Options error:\n";

const inputNotSpecifiedError = () => {
  return new Error(
    `${HEADER} Input file was not specified, use --input <file> or -i <file>`
  );
};

const outputNotSpecifiedError = () => {
  return new Error(
    `${HEADER} Output file was not specified, use --output <file> or -o <file>`
  );
};

const inputDoesNotExistError = fileName => {
  return new Error(`${HEADER} Input file "${fileName}" does not exist`);
};

module.exports = {
  inputNotSpecifiedError,
  outputNotSpecifiedError,
  inputDoesNotExistError
};
