const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const fs = require("fs");
const {
  inputNotSpecifiedError,
  outputNotSpecifiedError,
  inputDoesNotExistError
} = require("../errors/optionsErrors");

const setupOptions = () => {
  const optionDefinitions = [
    {
      name: "help",
      alias: "h",
      type: Boolean,
      description: "Display this usage guide"
    },
    {
      name: "input",
      alias: "i",
      type: String,
      multiple: false,
      description: "File with Oredon source code",
      typeLabel: "<file>"
    },
    {
      name: "output",
      alias: "o",
      type: String,
      multiple: false,
      description: "File with compiled instructions",
      typeLabel: "<file>"
    }
  ];

  return commandLineArgs(optionDefinitions);
};

const printOptionsUsage = () => {
  console.log(
    commandLineUsage([
      {
        header: "Oredon Compiler",
        content:
          "Compiler for Oredon programming language, takes input file with Oredon code and outputs a file with compiled instructions."
      },
      {
        header: "Options",
        optionList: optionDefinitions
      },
      {
        content:
          "Project home: [underline]{https://github.com/martyzz/oredon-compiler}"
      }
    ])
  );
};

const verifyOptions = (input, output) => {
  if (!input) throw inputNotSpecifiedError();
  if (!output) throw outputNotSpecifiedError();
  if (!fs.existsSync(input)) throw inputDoesNotExistError(input);
};

module.exports = {
  setupOptions,
  printOptionsUsage,
  verifyOptions
};
