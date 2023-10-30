const createMalString = (str) => {
  const formattedString = str.slice(1, -1).replaceAll(/\\(.)/g, (_, char) => {
    switch (char) {
      case 'n':
        return '\n';
      case '"':
        return '"';
      default:
        return char;
    }
  });

  return new MalString(formattedString);
};

const makeReadable = (str) =>
  str.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\n');

const pairReducer = (list, fn, ctx = list[0]) => {
  for (let i = 0; i < list.length - 1; i++) {
    ctx = fn(ctx, list[i], list[i + 1]);
  }
  return ctx;
};

const escapeChars = (str) =>
  str.replaceAll('\\n', '\n').replaceAll('\\"', '"').replaceAll('\\\\', '\\');

class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }

  equals(malValue) {
    return this.value === malValue.value;
  }
}

const pr_str = (malValue, print_readably) => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str(print_readably);
  }
  return malValue.toString();
};

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return this.value.toString();
  }

  equals(malSymbol) {
    if (malSymbol instanceof MalSymbol) {
      return super.equals(malSymbol);
    }
    return false;
  }
}

const isBoolean = (val) => [true, false].includes(val);
class Iteratable extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(malList) {
    const areOfSameType = malList instanceof Iteratable;
    const isString = malList instanceof MalString;
    const areEqalInLength =
      areOfSameType && malList.value.length === this.value.length;

    return (
      !isString &&
      areEqalInLength &&
      this.value.every((element, i) => {
        const respElement = malList.value[i];
        if (isBoolean(respElement) || isBoolean(element)) {
          return respElement === element;
        }
        return element.equals(respElement);
      })
    );
  }

  isEmpty() {
    return this.value.length === 0;
  }

  nth(n) {
    if (n >= this.value.length) {
      throw 'range out of bound';
    }
    return this.value[n];
  }

  first() {
    return this.isEmpty() ? new MalNil() : this.value[0];
  }

  rest() {
    return new MalList(this.value.slice(1));
  }
}

class MalList extends Iteratable {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably) {
    return (
      '(' + this.value.map((x) => pr_str(x, print_readably)).join(' ') + ')'
    );
  }

  isEmpty() {
    return this.value.length === 0;
  }

  equals(malList) {
    return super.equals(malList);
  }

  beginsWith(symbol) {
    return this.value.length > 0 && this.value[0].value === symbol;
  }
}

class MalVector extends Iteratable {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably) {
    return (
      '[' + this.value.map((x) => pr_str(x, print_readably)).join(' ') + ']'
    );
  }

  equals(malVector) {
    return super.equals(malVector);
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  pr_str() {
    return 'nil';
  }
}

class MalMap extends Iteratable {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably) {
    return (
      '{' + this.value.map((x, i) => pr_str(x, print_readably)).join(' ') + '}'
    );
  }

  equals(malMap) {
    return super.equals(malMap);
  }
}

class MalString extends Iteratable {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably) {
    if (print_readably) {
      return '"' + makeReadable(this.value) + '"';
    }
    return this.value;
  }

  equals(malString) {
    if (!(malString instanceof MalString)) return false;
    return this.value === malString.value;
  }
}

class MalFunction extends MalValue {
  constructor(ast, bindings, env, ref, isMacro = false) {
    super(ast);
    this.bindings = bindings;
    this.env = env;
    this.ref = ref;
    this.isMacro = isMacro;
  }

  pr_str() {
    return '#<function>';
  }

  apply(ctx, args) {
    return this.ref.apply(ctx, args);
  }
}

class MalKeyword extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(malKeyword) {
    if (!(malKeyword instanceof MalKeyword)) return false;
    return this.value === malKeyword.value;
  }

  pr_str() {
    return this.value;
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(malAtom) {
    return malAtom.value === this.value;
  }

  pr_str() {
    return '(atom ' + this.value + ')';
  }

  deref() {
    return this.value;
  }

  reset(value) {
    this.value = value;
    return value;
  }

  swap(fnRef, args) {
    this.value = fnRef.apply(null, [this.value, ...args]);
    return this.value;
  }
}

module.exports = {
  MalSymbol,
  MalValue,
  MalList,
  MalVector,
  MalNil,
  MalMap,
  Iteratable,
  isBoolean,
  MalString,
  MalFunction,
  MalKeyword,
  makeReadable,
  pairReducer,
  escapeChars,
  createMalString,
  MalAtom,
  pr_str,
};
