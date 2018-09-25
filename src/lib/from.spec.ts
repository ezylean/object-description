// tslint:disable:no-expression-statement
import test from 'ava';
import { from } from './from';

test('simple object', t => {
  const description = {
    is_array: false,
    primitives: [
      { path: ['value'], value: true },
      { path: ['anotherValue'], value: false }
    ]
  };

  const expected = { value: true, anotherValue: false };

  t.deepEqual(from(description), expected);
});

test('nested object', t => {
  const description = {
    is_array: false,
    primitives: [
      { path: ['anotherValue'], value: false },
      { path: ['value', 'nested'], value: true }
    ]
  };

  const expected = { value: { nested: true }, anotherValue: false };

  t.deepEqual(from(description), expected);
});

test('nested w array', t => {
  const description = {
    is_array: false,
    primitives: [
      { path: ['anotherValue'], value: false },
      { path: ['value', 'nested', 0], value: 'hello' },
      { path: ['value', 'nested', 1], value: 'world' }
    ]
  };

  const expected = {
    anotherValue: false,
    value: { nested: ['hello', 'world'] }
  };

  t.deepEqual(from(description), expected);
});

test('simple array', t => {
  const description = {
    is_array: true,
    primitives: [{ path: [0], value: 'hello' }, { path: [1], value: 'world' }]
  };

  const expected = ['hello', 'world'];

  t.deepEqual(from(description), expected);
});

test('get empty objects/array decription', t => {
  t.deepEqual(
    from({
      is_array: false,
      primitives: []
    }),
    {}
  );

  t.deepEqual(
    from({
      is_array: true,
      primitives: []
    }),
    []
  );
});

test('README second exemple', t => {
  const desc = {
    is_array: false,
    primitives: [
      { path: ['value'], value: true },
      { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
    ]
  };

  const flatten = from({
    is_array: false,
    primitives: desc.primitives.map(({ path, value }) => {
      return { path, value: value.toString() };
    })
  });

  const expected = {
    lvl1: {
      lvl2: [[undefined, { 50: 'false' }]]
    },
    value: 'true'
  };

  t.deepEqual(flatten, expected);
});

test('simple object without is_array flag', t => {
  const description = {
    primitives: [
      { path: ['value'], value: true },
      { path: ['anotherValue'], value: false }
    ]
  };

  const expected = { value: true, anotherValue: false };

  t.deepEqual(from(description), expected);
});

test('simple circular reference', t => {
  const description = {
    primitives: [{ path: ['someprop'], value: 'something' }],
    references: [{ path: ['imcircular'], target: [] }]
  };

  const expected: any = {
    someprop: 'something'
  };
  expected.imcircular = expected;

  t.deepEqual(from(description), expected);
});
