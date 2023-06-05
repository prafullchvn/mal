const { pr_str } = require('./printer.js');
const {
  MalSymbol,
  MalList,
  MalValue,
  MalMap,
  MalVector,
  MalNil,
  Iteratable,
  isBoolean,
} = require('./types.js');

const pairReducer = (list, fn, ctx = list[0]) => {
  for (let i = 0; i < list.length - 1; i++) {
    ctx = fn(ctx, list[i], list[i + 1]);
  }
  return ctx;
};

const escapeChars = (str) =>
  str.replaceAll('\\n', '\n').replaceAll('\\"', '"').replaceAll('\\\\', '\\');

module.exports = [
  {
    symbol: '+',
    fn: (...args) => args.reduce((a, b) => new MalValue(a.value + b.value)),
  },
  {
    symbol: '-',
    fn: (...args) => args.reduce((a, b) => new MalValue(a.value - b.value)),
  },
  {
    symbol: '*',
    fn: (...args) => args.reduce((a, b) => new MalValue(a.value * b.value)),
  },
  {
    symbol: '/',
    fn: (...args) =>
      args.reduce((a, b) => new MalValue(a.value / b.value), new MalValue(1)),
  },
  {
    symbol: 'println',
    fn: (...args) => {
      console.log(...args.map((x) => escapeChars(pr_str(x))));
      return new MalNil();
    },
  },
  {
    symbol: 'prn',
    fn: (...args) => {
      console.log(...args.map((x) => pr_str(x, true)));
      return new MalNil();
    },
  },
  {
    symbol: 'pr-str',
    fn: (...args) => {
      return '"' + args.map((x) => pr_str(x, true, true)).join(' ') + '"';
    },
  },
  {
    symbol: 'str',
    fn: (...args) =>
      '"' + args.map((arg) => pr_str(arg, false, false)).join('') + '"',
  },
  {
    symbol: '>',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1.value > num2.value, true),
  },
  {
    symbol: '<',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1.value < num2.value, true),
  },
  {
    symbol: '>=',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1.value >= num2.value, true),
  },
  {
    symbol: '<=',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1.value <= num2.value, true),
  },
  {
    symbol: '=',
    fn: (...args) => {
      const reducer = (c, arg1, arg2) => {
        if (isBoolean(arg1) || isBoolean(arg2)) return arg1 === arg2;
        return c && arg1.equals(arg2);
      };

      return pairReducer(args, reducer, true);
    },
  },
  {
    symbol: 'not=',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && !num1.equals(num2), true),
  },
  {
    symbol: 'list',
    fn: (...args) => new MalList(args),
  },
  {
    symbol: 'list?',
    fn: (arg) => arg instanceof MalList,
  },
  {
    symbol: 'empty?',
    fn: (arg) => arg instanceof Iteratable && arg.isEmpty(),
  },
  {
    symbol: 'count',
    fn: (arg) => {
      if (arg instanceof Iteratable) return new MalValue(arg.value.length);
      else if (arg instanceof MalNil) return new MalValue(0);
    },
  },
];
