const { read_str } = require('./reader.js');
const { pr_str } = require('./printer.js');
const readline = require('readline');

const READ = (arg) => read_str(arg);
const EVAL = (arg) => arg;
const PRINT = (malValue) => pr_str(malValue);
const rep = (arg) => PRINT(EVAL(READ(arg)));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repl = () =>
  rl.question('user> ', (line) => {
    try {
      console.log(rep(line));
    } catch (error) {
      console.log(error);
    }
    repl();
  });

repl();
