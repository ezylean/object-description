// tslint:disable:no-expression-statement
// tslint:disable:max-classes-per-file
import test from 'ava';
import { to } from './to';

test('simple object', t => {
  const obj = { value: true, anotherValue: false };

  const expected = {
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
    values: [
      { path: ['anotherValue'], value: false },
      { path: ['value', 'nested'], value: true }
    ]
  };

  t.deepEqual(to(obj), expected);
});

test('nested w array', t => {
  const obj = { value: { nested: ['hello', 'world'] }, anotherValue: false };

  const expected = {
    values: [
      { path: ['anotherValue'], value: false },
      { path: ['value', 'nested', 0], value: 'hello' },
      { path: ['value', 'nested', 1], value: 'world' }
    ]
  };

  t.deepEqual(to(obj), expected);
});

test('simple array', t => {
  const obj = ['hello', 'world'];

  const expected = {
    is_array: true,
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
    values: [
      { path: ['users', 0], value: new User('hubert', 22) },
      { path: ['users', 1], value: new User('john', 25) }
    ]
  };

  t.deepEqual(to(obj), expected);
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
    values: [
      { path: ['users', 0], value: new User('hubert', 22) },
      { path: ['users', 1], value: new User('john', 25) }
    ]
  };

  t.deepEqual(to(obj), expected);
});

test('undefined values are not preserved', t => {
  const obj = { value: true, anotherValue: false, imaghost: undefined };

  const expected = {
    values: [
      { path: ['value'], value: true },
      { path: ['anotherValue'], value: false }
    ]
  };

  t.deepEqual(to(obj), expected);
});

test('get empty objects/array decription', t => {
  t.deepEqual(to({}), {
    values: []
  });

  t.deepEqual(to([]), {
    is_array: true,
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
    references: [{ path: ['imcircular'], target: [] }],
    values: [{ path: ['someprop'], value: 'something' }]
  };

  t.deepEqual(flatten, expected);
});
