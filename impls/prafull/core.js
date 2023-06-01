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
      args.forEach((x) => process.stdout.write(pr_str(x) + ' '));
      console.log();
      return new MalNil();
    },
  },
  {
    symbol: 'prn',
    fn: (...args) => {
      args.forEach((x) => process.stdout.write(pr_str(x) + ' '));
      console.log();
      return new MalNil();
    },
  },
  {
    symbol: 'pr-str',
    fn: (...args) => {
      args.forEach((x) => process.stdout.write(pr_str(x) + ' '));
      console.log();
      return new MalNil();
    },
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
      const isTypeSame = pairReducer(
        args,
        (c, value1, value2) => c && typeof value1 === typeof value2
      );

      const reducer = (c, arg1, arg2) => {
        if (isBoolean(arg1) || isBoolean(arg2)) return arg1 === arg2;
        return c && arg1.equals(arg2);
      };
      const areEqual = isTypeSame && pairReducer(args, reducer);

      return areEqual;
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
    fn: (arg) => arg instanceof Iteratable && arg.value.length,
  },
];
