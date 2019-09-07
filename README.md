<h1 align="center">
  <img src="https://fakeimg.pl/900x300/ffffff/333333/?text=object+description&font=museo" alt="object description" width="900px" />
</h1>

<p align="center">a more robust representation for flatten objects/arrays.</p>

<p align="center">
<a href="https://opensource.org/licenses">
  <img src="https://img.shields.io/github/license/ezylean/object-description.svg" alt="License" />
</a>
<a href="https://circleci.com/gh/ezylean/object-description/tree/master">
  <img src="https://circleci.com/gh/ezylean/object-description/tree/master.svg?style=shield" alt="CircleCI" />
</a>
<a href="https://codecov.io/gh/ezylean/object-description">
  <img src="https://codecov.io/gh/ezylean/object-description/branch/master/graph/badge.svg" alt="codecov" />
</a>
<a href="https://ezylean.github.io/object-description">
  <img src="https://img.shields.io/badge/docs-typedoc-%239B55FC.svg" alt="Docs: typedoc" />
</a>
<a href="https://github.com/ezylean/object-description/issues">
  <img src="https://img.shields.io/github/issues-raw/ezylean/object-description.svg" alt="GitHub issues" />
</a>
<a href="https://codeclimate.com/github/ezylean/object-description/maintainability" >
  <img src="https://img.shields.io/codeclimate/maintainability-percentage/ezylean/object-description.svg" alt="Maintainability" />
</a>
<a href="https://david-dm.org/ezylean/object-description">
  <img src="https://david-dm.org/ezylean/object-description.svg" alt="Dependencies status" />
</a>
<a href="https://david-dm.org/ezylean/object-description?type=dev">
  <img src="https://david-dm.org/ezylean/object-description/dev-status.svg" alt="Dev Dependencies status" />
</a>
<a href="https://github.com/Microsoft/TypeScript">
  <img src="https://img.shields.io/badge/made%20with-typescript-%234B9DD5.svg" alt="Made with: typescript" />
</a>
<a href="https://github.com/prettier/prettier">
  <img src="https://img.shields.io/badge/code%20style-prettier-ff69b4.svg" alt="Code style: prettier" />
</a>
<a href="https://npm.runkit.com/@ezy/object-description">
  <img src="https://img.shields.io/badge/runkit-try%20now-%236967CA.svg" alt="Runkit: try now" />
</a>
<a href="https://bundlephobia.com/result?p=@ezy/object-description">
  <img src="https://img.shields.io/bundlephobia/min/@ezy/object-description.svg" alt="minified size" />
</a>
<a href="https://bundlephobia.com/result?p=@ezy/object-description">
  <img src="https://img.shields.io/bundlephobia/minzip/@ezy/object-description.svg" alt="minzipped size" />
</a>
</p>

## Why

flatten/unflatten libraries relies on string based notation for paths leading to mismatches in conversions.

## Install

```shell
npm i @ezy/object-description
```

## Usage

### iterate over values

```js
import { to as toDescription } from '@ezy/object-description';

const desc = toDescription({
  value: true,
  lvl1: {
    lvl2: [[undefined, { 50: false }]]
  }
});

for (const { path, value } of desc.values) {
  console.log(path);
  console.log(value);
}

// ['value']
// true
// ['lvl1', 'lvl2', 0, 1, '50']
// false
```

### change all values

```js
import {
  from as fromDescription,
  to as toDescription
} from '@ezy/object-description';

const desc = toDescription({
  value: true,
  lvl1: {
    lvl2: [[undefined, { 50: false }]]
  }
});

const stringified = fromDescription({
  Ctor: desc.Ctor,
  values: desc.values.map(({ path, value }) => {
    return { path, value: value.toString() };
  })
});

console.log(stringified);

// {
//     value: "true",
//     lvl1: {
//         lvl2: [
//             [ undefined, { 50: "false" } ]
//         ]
//     }
// }
```

### circular references support

deep clone made easy

```js
import {
  from as fromDescription,
  to as toDescription
} from '@ezy/object-description';

const original: any = {
  someprop: 'something'
};
original.imcircular = original;

const desc = toDescription(original);
console.log(desc);
// => {
//   Ctor: Object,
//   values: [{ path: ['someprop'], value: 'something' }],
//   references: [{ path: ['imcircular'], target: [] }]
// }

const clone = fromDescription(desc);
console.log(clone);
// => {
//   someprop: 'something',
//   imcircular: [Circular]
// }
```

## Links

- [API docs](https://ezylean.github.io/object-description)
- [Playground](https://npm.runkit.com/@ezy/object-description)

## See also

- https://ramdajs.com/docs/#assocPath
- https://ramdajs.com/docs/#dissocPath
- https://ramdajs.com/docs/#lensPath
- https://ramdajs.com/docs/#path
- https://ramdajs.com/docs/#pathEq
- https://ramdajs.com/docs/#pathOr
- https://ramdajs.com/docs/#pathSatisfies
