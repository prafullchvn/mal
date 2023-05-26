// const { stdin, stdout } = process;

const READ = (arg) => arg;
const EVAL = (arg) => arg;
const PRINT = (arg) => arg;
const rep = (arg) => PRINT(EVAL(READ(arg)));

// const main = () => {
//   stdin.setEncoding('utf8');
//   stdout.write('user> ');
//   stdin.on('data', (line) => {
//     stdout.write(rep(line));
//     stdout.write('user> ');
//   });
// };

// main();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const repl = () =>
  rl.question('user> ', (line) => {
    console.log(rep(line));
    repl();
  });

repl();
