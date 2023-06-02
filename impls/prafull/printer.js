const { MalValue } = require('./types.js');

const makeReadable = (str) => {
  return str.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
};

const pr_str = (malValue, print_readably, escapeChars = false) => {
  if (malValue instanceof MalValue) {
    const str = malValue.pr_str(print_readably);
    return escapeChars ? makeReadable(str) : str;
  }
  return malValue.toString();
};

module.exports = { pr_str };
