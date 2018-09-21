// tslint:disable:no-expression-statement
import test from 'ava';
import { from } from './from';

test('simple object', t => {
  const description = [
    { path: ['value'], value: true },
    { path: ['anotherValue'], value: false }
  ];

  const expected = { value: true, anotherValue: false };

  t.deepEqual(from(description), expected);
});

test('nested object', t => {
  const description = [
    { path: ['anotherValue'], value: false },
    { path: ['value', 'nested'], value: true }
  ];

  const expected = { value: { nested: true }, anotherValue: false };

  t.deepEqual(from(description), expected);
});

test('nested w array', t => {
  const description = [
    { path: ['anotherValue'], value: false },
    { path: ['value', 'nested', 0], value: 'hello' },
    { path: ['value', 'nested', 1], value: 'world' }
  ];

  const expected = {
    anotherValue: false,
    value: { nested: ['hello', 'world'] }
  };

  t.deepEqual(from(description), expected);
});

test('simple array', t => {
  const description = [
    { path: [0], value: 'hello' },
    { path: [1], value: 'world' }
  ];

  const expected = ['hello', 'world'];

  t.deepEqual(from(description), expected);
});
