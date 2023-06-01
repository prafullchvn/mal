const { pr_str } = require('./printer.js');
const { read_str } = require('./reader.js');
const core = require('./core.js');
const {
  MalSymbol,
  MalList,
  MalValue,
  MalMap,
  MalVector,
  MalNil,
  Iteratable,
} = require('./types.js');
const readline = require('readline');
const { Env } = require('./env.js');

const env = new Env();
core.forEach(({ symbol, fn }) => env.set(new MalSymbol(symbol), fn));

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    const value = env.get(ast);
    return value !== undefined ? value : value;
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
  const bindings = ast.value[1];
  for (let i = 0; i < bindings.value.length; i += 2) {
    letEnv.set(bindings.value[i], EVAL(bindings.value[i + 1], letEnv));
  }
  return EVAL(ast.value[2], letEnv);
};

const handle_def = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return env.get(ast.value[1]);
};

const handle_do = (ast, env) => {
  const exprs = ast.value.slice(1);
  return exprs.reduce((_, expr) => EVAL(expr, env), new MalNil());
};

const handle_if = (ast, env) => {
  const [_, condition, trueBlock, falseBlock] = ast.value;
  const evaluatedValue = EVAL(condition, env);
  if (!(evaluatedValue instanceof MalNil || evaluatedValue === false)) {
    return EVAL(trueBlock, env);
  }
  if (falseBlock !== undefined) return EVAL(falseBlock, env);
  return new MalNil();
};

// (def! not (fn* [x] (if x false true)))
const handle_fn = (ast, env) => {
  const [_, bindings, body] = ast.value;
  const clojure = (...args) => {
    const fnEnv = new Env(env);
    bindings.value.forEach((variable, i) =>
      fnEnv.set(variable, EVAL(args[i], fnEnv))
    );
    return EVAL(body, fnEnv);
  };
  clojure.toString = () => '#<function>';
  return clojure;
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
    case 'do':
      return handle_do(ast, env);
    case 'if':
      return handle_if(ast, env);
    case 'fn*':
      return handle_fn(ast, env);
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
