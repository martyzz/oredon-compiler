const fs = require("fs");
const compile = require("./src/compile");
const measure = require("./src/utilities/measure");
const {
  setupOptions,
  printOptionsUsage,
  verifyOptions
} = require("./src/utilities/options");

const { input, output, help } = setupOptions();

if (help) {
  printOptionsUsage();
  return;
}

try {
  verifyOptions(input, output);

  console.log(`Reading input file "${input}"...`);
  const oreScript = fs.readFileSync(input, "utf8");

  console.log(`Compiling...`);
  const start = measure();
  const oreInstructions = compile(oreScript);
  const duration = measure(start);
  console.log(`Compilation successful! (${duration} ms)`);

  console.log(`Writing output file "${output}"...`);
  fs.writeFileSync(output, oreInstructions, "utf8");
} catch (error) {
  console.error(error.message);
}
