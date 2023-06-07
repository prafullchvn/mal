const { MalList } = require('./types');

class Env {
  constructor(outer, binds, args) {
    this.outer = outer;
    this.data = {};
    this.#setBinds(binds, args);
  }

  #setBinds(binds, args) {
    if (binds === undefined || args === undefined) {
      return;
    }
    const bindsList = binds.value;
    bindsList.every((bindVar, i) => {
      if (bindVar.value === '&') {
        this.set(bindsList[i + 1], new MalList(args.slice(i)));
        return false;
      }
      this.set(bindVar, args[i]);
      return true;
    });
  }

  set(symbol, value) {
    this.data[symbol.value] = value;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) return this;

    if (this.outer) {
      return this.outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) {
      throw `${symbol.value} not found`;
    }
    return env.data[symbol.value];
  }
}

module.exports = { Env };
