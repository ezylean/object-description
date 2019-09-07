// tslint:disable:no-expression-statement
import test from 'ava';
import { from } from './from';

test('simple object', t => {
  const description = {
    Ctor: Object,
    values: [
      { path: ['value'], value: true },
      { path: ['anotherValue'], value: false }
    ]
  };

  const expected = { value: true, anotherValue: false };

  t.deepEqual(from(description), expected);
});

test('nested object', t => {
  const description = {
    Ctor: Object,
    values: [
      { path: ['anotherValue'], value: false },
      { path: ['value', 'nested'], value: true }
    ]
  };

  const expected = { value: { nested: true }, anotherValue: false };

  t.deepEqual(from(description), expected);
});

test('nested w array', t => {
  const description = {
    Ctor: Object,
    values: [
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

test('nested w array and structures', t => {
  const description = {
    Ctor: Object,
    structures: [
      { path: ['value'], Ctor: Object },
      { path: ['value', 'nested'], Ctor: Array }
    ],
    values: [
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
    Ctor: Array,
    values: [{ path: [0], value: 'hello' }, { path: [1], value: 'world' }]
  };

  const expected = ['hello', 'world'];

  t.deepEqual(from(description), expected);
});

test('get empty objects/array decription', t => {
  t.deepEqual(
    from({
      Ctor: Object,
      values: []
    }),
    {}
  );

  t.deepEqual(
    from({
      Ctor: Array,
      values: []
    }),
    []
  );
});

test('README second exemple', t => {
  const desc = {
    Ctor: Object,
    values: [
      { path: ['value'], value: true },
      { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
    ]
  };

  const flatten = from({
    Ctor: Object,
    values: desc.values.map(({ path, value }) => {
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

test('simple circular reference', t => {
  const description = {
    Ctor: Object,
    references: [{ path: ['imcircular'], target: [] }],
    values: [{ path: ['someprop'], value: 'something' }]
  };

  const expected: any = {
    someprop: 'something'
  };
  expected.imcircular = expected;

  t.deepEqual(from(description), expected);
});

test('nested object with circular references', t => {
  const description = {
    Ctor: Object,
    references: [
      { path: ['lvl1', 'lvl2', 'imcircular'], target: [] },
      { path: ['lvl1', 'lvl2', 'anothercircular'], target: ['lvl1'] },
      { path: ['lvl1', 'lvl2', 'undefinedreference'], target: ['not', 'found'] }
    ],
    values: [{ path: ['someprop'], value: 'something' }]
  };

  const expected: any = {
    someprop: 'something'
  };
  expected.lvl1 = {
    lvl2: {
      imcircular: expected
    }
  };
  expected.lvl1.lvl2.anothercircular = expected.lvl1;

  t.deepEqual(from(description), expected);
});
