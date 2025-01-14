const { pr_str } = require('./printer.js');
const { read_str } = require('./reader.js');
const {
  MalSymbol,
  MalList,
  MalValue,
  MalMap,
  MalVector,
} = require('./types.js');
const readline = require('readline');

const env = {
  '+': (...args) => args.reduce((a, b) => new MalValue(a.value + b.value)),
  '-': (...args) => args.reduce((a, b) => new MalValue(a.value - b.value)),
  '/': (...args) => args.reduce((a, b) => new MalValue(a.value / b.value)),
  '*': (...args) => args.reduce((a, b) => new MalValue(a.value * b.value)),
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env[ast.value] || ast;
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalVector(newAst);
  }

  if (ast instanceof MalMap) {
    const newAst = ast.value.map((x) => {
      console.log(x, EVAL(x, env));
      return EVAL(x, env);
    });
    return new MalMap(newAst);
  }

  return ast;
};

const READ = (arg) => read_str(arg);

const evalListInSeq = (ast, cb) => {
  return ast.value.map((val) => {
    if (val instanceof MalList) {
      return cb(val, env);
    }
    return val;
  });
};

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);
  if (ast.isEmpty()) return ast;

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const PRINT = (malValue) => pr_str(malValue);
const rep = (str) => PRINT(EVAL(READ(str), env));

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
