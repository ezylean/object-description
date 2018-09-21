// tslint:disable:no-expression-statement
// tslint:disable:max-classes-per-file
import test from 'ava';
import { to } from './to';

test('simple object', t => {
  const obj = { value: true, anotherValue: false };

  const expected = [
    { path: ['value'], value: true },
    { path: ['anotherValue'], value: false }
  ];

  t.deepEqual(to(obj), expected);
});

test('nested object', t => {
  const obj = { value: { nested: true }, anotherValue: false };

  const expected = [
    { path: ['anotherValue'], value: false },
    { path: ['value', 'nested'], value: true }
  ];

  t.deepEqual(to(obj), expected);
});

test('nested w array', t => {
  const obj = { value: { nested: ['hello', 'world'] }, anotherValue: false };

  const expected = [
    { path: ['anotherValue'], value: false },
    { path: ['value', 'nested', 0], value: 'hello' },
    { path: ['value', 'nested', 1], value: 'world' }
  ];

  t.deepEqual(to(obj), expected);
});

test('simple array', t => {
  const obj = ['hello', 'world'];

  const expected = [
    { path: [0], value: 'hello' },
    { path: [1], value: 'world' }
  ];

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

  const expected = [
    { path: ['users', 0, 'name'], value: 'hubert' },
    { path: ['users', 0, 'age'], value: 22 },
    { path: ['users', 1, 'name'], value: 'john' },
    { path: ['users', 1, 'age'], value: 25 }
  ];

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

  const expected = [
    { path: ['users', 0, 'name'], value: 'hubert' },
    { path: ['users', 0, 'age'], value: 22 },
    { path: ['users', 1, 'name'], value: 'john' },
    { path: ['users', 1, 'age'], value: 25 }
  ];

  t.deepEqual(to(obj), expected);
});

test('undefined values are not keeped', t => {
  const obj = { value: true, anotherValue: false, imaghost: undefined };

  const expected = [
    { path: ['value'], value: true },
    { path: ['anotherValue'], value: false }
  ];

  t.deepEqual(to(obj), expected);
});
