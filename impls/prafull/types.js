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
}

class MalList extends Iteratable {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably) {
    return (
      '(' + this.value.map((x) => x.pr_str(print_readably)).join(' ') + ')'
    );
  }

  isEmpty() {
    return this.value.length === 0;
  }

  equals(malList) {
    return super.equals(malList);
  }
}

class MalVector extends Iteratable {
  constructor(value) {
    super(value);
  }

  pr_str(print_readably) {
    return (
      '[' + this.value.map((x) => x.pr_str(print_readably)).join(' ') + ']'
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

  pr_str() {
    return '{' + this.value.map((x, i) => x.pr_str()).join(' ') + '}';
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
      return '"' + this.value + '"';
    }
    return this.value;
  }

  equals(malString) {
    if (!(malString instanceof MalString)) return false;
    return this.value === malString.value;
  }
}

class MalFunction extends MalValue {
  constructor(ast, bindings, env) {
    super(ast);
    this.bindings = bindings;
    this.env = env;
  }

  pr_str() {
    return '#<function>';
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
};
