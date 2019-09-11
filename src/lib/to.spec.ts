// tslint:disable:no-expression-statement
// tslint:disable:max-classes-per-file
import test from 'ava';
import { to } from './to';

test('simple object', t => {
  const obj = { value: true, anotherValue: false };

  const expected = {
    Ctor: Object,
    values: [
      { path: ['value'], value: true },
      { path: ['anotherValue'], value: false }
    ]
  };

  t.deepEqual(to(obj), expected);
});

test('nested object', t => {
  const obj = { value: { nested: true }, anotherValue: false };

  const expected = {
    structures: [{ path: [], Ctor: Object }, { path: ['value'], Ctor: Object }],
    values: [
      { path: ['anotherValue'], value: false },
      { path: ['value', 'nested'], value: true }
    ]
  };

  t.deepEqual(to(obj, true), expected);
});

test('nested w array', t => {
  const obj = { value: { nested: ['hello', 'world'] }, anotherValue: false };

  const expected = {
    structures: [
      { path: [], Ctor: Object },
      { path: ['value'], Ctor: Object },
      { path: ['value', 'nested'], Ctor: Array }
    ],
    values: [
      { path: ['anotherValue'], value: false },
      { path: ['value', 'nested', 0], value: 'hello' },
      { path: ['value', 'nested', 1], value: 'world' }
    ]
  };

  t.deepEqual(to(obj, true), expected);
});

test('simple array', t => {
  const obj = ['hello', 'world'];

  const expected = {
    Ctor: Array,
    values: [{ path: [0], value: 'hello' }, { path: [1], value: 'world' }]
  };

  t.deepEqual(to(obj), expected);
});

test('support classic classes', t => {
  function User(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  User.prototype.run = () => {
    // im running silently ^^
  };

  const obj = { users: [new User('hubert', 22), new User('john', 25)] };

  const expected = {
    structures: [{ path: [], Ctor: Object }, { path: ['users'], Ctor: Array }],
    values: [
      { path: ['users', 0], value: new User('hubert', 22) },
      { path: ['users', 1], value: new User('john', 25) }
    ]
  };

  t.deepEqual(to(obj, true), expected);
});

test('support es6 classes', t => {
  class User {
    constructor(public name: string, public age: number) {}

    public run() {
      // im running silently ^^
    }
  }

  const obj = { users: [new User('hubert', 22), new User('john', 25)] };

  const expected = {
    structures: [{ path: [], Ctor: Object }, { path: ['users'], Ctor: Array }],
    values: [
      { path: ['users', 0], value: new User('hubert', 22) },
      { path: ['users', 1], value: new User('john', 25) }
    ]
  };

  t.deepEqual(to(obj, true), expected);
});

test('undefined values are not preserved', t => {
  const obj = { value: true, anotherValue: false, imaghost: undefined };

  const expected = {
    Ctor: Object,
    values: [
      { path: ['value'], value: true },
      { path: ['anotherValue'], value: false }
    ]
  };

  t.deepEqual(to(obj), expected);
});

test('get empty objects/array decription', t => {
  t.deepEqual(to({}), {
    Ctor: Object,
    values: []
  });

  t.deepEqual(to([]), {
    Ctor: Array,
    values: []
  });
});

test('README first exemple', t => {
  const flatten = to({
    lvl1: {
      lvl2: [[undefined, { 50: false }]]
    },
    value: true
  });

  const expected = {
    Ctor: Object,
    values: [
      { path: ['value'], value: true },
      { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
    ]
  };

  t.deepEqual(flatten, expected);
});

test('README first exemple - register structs', t => {
  const flatten = to(
    {
      lvl1: {
        lvl2: [[undefined, { 50: false }]]
      },
      value: true
    },
    true
  );

  const expected = {
    structures: [
      { path: [], Ctor: Object },
      { path: ['lvl1'], Ctor: Object },
      { path: ['lvl1', 'lvl2'], Ctor: Array },
      { path: ['lvl1', 'lvl2', 0], Ctor: Array },
      { path: ['lvl1', 'lvl2', 0, 1], Ctor: Object }
    ],
    values: [
      { path: ['value'], value: true },
      { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
    ]
  };

  t.deepEqual(flatten, expected);
});

test('simple circular reference', t => {
  const obj: any = {
    someprop: 'something'
  };
  obj.imcircular = obj;

  const flatten = to(obj);

  const expected = {
    Ctor: Object,
    references: [{ path: ['imcircular'], target: [] }],
    values: [{ path: ['someprop'], value: 'something' }]
  };

  t.deepEqual(flatten, expected);
});
