class Reader {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.tokens[this.position];
    this.position++;
    return token;
  }
}

const tokenize = (str) => {
  const re =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  return [...str.matchAll(re)].map((x) => x[1]).filter((x) => x);
};

const read_list = (reader) => {
  const ast = [];
  while (reader.peek() != ')') {
    ast.push(read_form(reader));
  }
  reader.next();
  return ast;
};

const read_atom = (reader) => {
  const token = reader.next();
  if (token.match(/^-?\d+$/)) {
    return parseInt(token);
  }
  return token;
};

const read_form = (reader) => {
  const token = reader.peek();
  switch (token) {
    case '(':
      reader.next();
      return read_list(reader);
    default:
      return read_atom(reader);
  }
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { read_str };
