// tslint:disable:no-expression-statement
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
