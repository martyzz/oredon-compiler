const measure = start => {
  if (!start) return process.hrtime();
  let end = process.hrtime(start);
  return Math.round(end[0] * 1000 + end[1] / 1000000);
};

module.exports = measure;
