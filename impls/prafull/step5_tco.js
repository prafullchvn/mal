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
  MalFunction,
} = require('./types.js');
const readline = require('readline');
const { Env } = require('./env.js');

const env = new Env();
core.forEach(({ symbol, fn }) => env.set(new MalSymbol(symbol), fn));
env.set(new MalSymbol('not'), (arg) => {
  if (arg.value === 0) return false;
  if (EVAL(arg, env) instanceof MalNil) return true;
  return !EVAL(arg, env);
});

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
  const [, bindings, ...forms] = ast.value;
  for (let i = 0; i < bindings.value.length; i += 2) {
    letEnv.set(bindings.value[i], EVAL(bindings.value[i + 1], letEnv));
  }
  const doForm = new MalList([new MalSymbol('do'), ...forms]);
  return [doForm, letEnv];
};

const handle_def = (ast, env) => {
  env.set(ast.value[1], EVAL(ast.value[2], env));
  return ast.value[1];
};

const handle_do = (ast, env) => {
  const forms = ast.value.slice(1);
  forms.slice(0, -1).reduce((_, expr) => EVAL(expr, env), new MalNil());
  return forms[forms.length - 1];
};

const handle_if = (ast, env) => {
  const [_, condition, trueForm, falseForm] = ast.value;
  const evaluatedValue = EVAL(condition, env);
  if (!(evaluatedValue instanceof MalNil || evaluatedValue === false)) {
    return trueForm;
  }
  if (falseForm !== undefined) return falseForm;
  return new MalNil();
};

const handle_fn = (ast, env) => {
  const [_, bindings, ...forms] = ast.value;
  const doForms = new MalList([new MalSymbol('do'), ...forms]);
  return new MalFunction(doForms, bindings, env);
};

const READ = (arg) => read_str(arg);
const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);
    if (ast.isEmpty()) return ast;

    switch (ast.value[0].value) {
      case 'def!':
        ast = handle_def(ast, env);
        break;
      case 'let*':
        [ast, env] = handle_let(ast, env);
        break;
      case 'do':
        ast = handle_do(ast, env);
        break;
      case 'if':
        ast = handle_if(ast, env);
        break;
      case 'fn*':
        ast = handle_fn(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;
        if (fn instanceof MalFunction) {
          ast = fn.value;
          env = new Env(fn.env, fn.bindings, args);
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const PRINT = (malValue) => pr_str(malValue, true);
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