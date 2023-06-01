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
    const areEqalInLength =
      areOfSameType && malList.value.length === this.value.length;

    return (
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

  pr_str() {
    return '(' + this.value.map((x) => x.pr_str()).join(' ') + ')';
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

  pr_str() {
    return '[' + this.value.map((x) => x.pr_str()).join(' ') + ']';
  }

  equals(malVector) {
    // if (malVector instanceof MalVector) {
    return super.equals(malVector);
    // }
    // return false;
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
    // if (malMap instanceof MalMap) {
    return super.equals(malMap);
    // }
    // return false;
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
};
