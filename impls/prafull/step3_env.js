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
const { Env } = require('./env.js');

const _env = {
  '+': (...args) => args.reduce((a, b) => new MalValue(a.value + b.value)),
  '-': (...args) => args.reduce((a, b) => new MalValue(a.value - b.value)),
  '/': (...args) => args.reduce((a, b) => new MalValue(a.value / b.value)),
  '*': (...args) => args.reduce((a, b) => new MalValue(a.value * b.value)),
};

const env = new Env();
env.set(new MalSymbol('+'), (...args) =>
  args.reduce((a, b) => new MalValue(a.value + b.value))
);
env.set(new MalSymbol('-'), (...args) =>
  args.reduce((a, b) => new MalValue(a.value - b.value))
);
env.set(new MalSymbol('*'), (...args) =>
  args.reduce((a, b) => new MalValue(a.value * b.value))
);
env.set(new MalSymbol('/'), (...args) =>
  args.reduce((a, b) => new MalValue(a.value / b.value))
);

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast) || ast;
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalMap) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalMap(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalVector(newAst);
  }

  return ast;
};

const handle_let = (ast, env) => {
  const letEnv = new Env(env);
  for (let i = 0; i < ast.value[1].value.length; i += 2) {
    letEnv.set(ast.value[1].value[i], EVAL(ast.value[1].value[i + 1], letEnv));
  }
  return EVAL(ast.value[2], letEnv);
};

const handle_def = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
};

const READ = (arg) => read_str(arg);
const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, env);
  if (ast.isEmpty()) return ast;

  switch (ast.value[0].value) {
    case 'def!':
      return handle_def(ast, env);
    case 'let*':
      return handle_let(ast, env);
  }

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
