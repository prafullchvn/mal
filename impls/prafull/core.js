const { readFileSync } = require('fs');
const { pr_str } = require('./printer.js');
const { read_str } = require('./reader.js');
const {
  MalSymbol,
  MalList,
  MalValue,
  MalMap,
  MalVector,
  MalNil,
  Iteratable,
  isBoolean,
  MalString,
  pairReducer,
  escapeChars,
  makeReadable,
  createMalString,
  MalAtom,
} = require('./types.js');

module.exports = [
  {
    symbol: '+',
    fn: (...args) => args.reduce((a, b) => a + b),
  },
  {
    symbol: '-',
    fn: (...args) => args.reduce((a, b) => a - b),
  },
  {
    symbol: '*',
    fn: (...args) => args.reduce((a, b) => a * b),
  },
  {
    symbol: '/',
    fn: (...args) => args.reduce((a, b) => a / b),
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
    fn: (...args) =>
      '"' + args.map((x) => pr_str(x, true, true)).join(' ') + '"',
  },
  {
    symbol: 'str',
    fn: (...args) =>
      new MalString(args.map((arg) => pr_str(arg, false)).join('')),
  },
  {
    symbol: '>',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1 > num2, true),
  },
  {
    symbol: '<',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1 < num2, true),
  },
  {
    symbol: '>=',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1 >= num2, true),
  },
  {
    symbol: '<=',
    fn: (...args) =>
      pairReducer(args, (c, num1, num2) => c && num1 <= num2, true),
  },
  {
    symbol: '=',
    fn: (...args) => {
      const reducer = (c, arg1, arg2) => {
        if (arg1 instanceof MalValue || arg2 instanceof MalValue) {
          return c && arg1.equals(arg2);
        }
        return arg1 === arg2;
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
      if (arg instanceof Iteratable) return arg.value.length;
      else if (arg instanceof MalNil) return 0;
    },
  },
  {
    symbol: 'read-string',
    fn: (str) => read_str(str.value),
  },
  {
    symbol: 'slurp',
    fn: (fileName) =>
      createMalString('"' + readFileSync(fileName.value, 'utf8') + '"'),
  },
  {
    symbol: 'atom',
    fn: (malValue) => new MalAtom(malValue),
  },
  {
    symbol: 'atom?',
    fn: (value) => value instanceof MalAtom,
  },
  {
    symbol: 'deref',
    fn: (malAtom) => malAtom.deref(),
  },
  {
    symbol: 'reset!',
    fn: (malAtom, malValue) => malAtom.reset(malValue),
  },
  // {
  //   symbol: 'inc1',
  //   fn: (malValue) => new MalValue(malValue.value + 1),
  // },
  // {
  //   symbol: 'inc2',
  //   fn: (malValue) => new MalValue(malValue.value + 2),
  // },
  // {
  //   symbol: 'inc3',
  //   fn: (malValue) => new MalValue(malValue.value + 3),
  // },
  {
    symbol: 'cons',
    fn: (element, list) => new MalList([element, ...list.value]),
  },
  {
    symbol: 'concat',
    fn: (...lists) => new MalList(lists.flatMap((x) => x.value)),
  },
  {
    symbol: 'vec',
    fn: (list) => new MalVector(list.value),
  },
  {
    symbol: 'swap!',
    fn: (atomicValue, fnRef, ...args) => atomicValue.swap(fnRef, args),
  },
  {
    symbol: 'nth',
    fn: (list, n) => list.nth(n),
  },
  {
    symbol: 'first',
    fn: (list) => (list instanceof MalNil ? new MalNil() : list.first()),
  },
  {
    symbol: 'rest',
    fn: (list) => (list instanceof MalNil ? new MalList([]) : list.rest()),
  },
];
