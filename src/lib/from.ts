import { Description, Path } from './description';

type Values = Array<{
  path: Path;
  value?: any;
  target?: Path;
  Ctor?: new () => any;
}>;

/**
 * assign a value to a target structure
 */
function defaultAssignValue(target, prop, value) {
  target[prop] = value;
}

/**
 * assign a structure to a target structure
 */
function defaultAssignStructure(target, prop, Ctor) {
  target[prop] = new Ctor();
}

/**
 * Convert an object/array description in it's exact representation.
 *
 * ### Example
 * ```js
 * import { from as fromDescription } from '@ezy/object-description'
 * console.log(fromDescription({
 *  Ctor: Object,
 *  values: [
 *   { path: ['value'], value: true },
 *   { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
 * ]
 * }))
 * // => { value: true, lvl1: { lvl2: [ [ undefined, { '50': false } ] ] } }
 * ```
 *
 * @param value   a description object.
 * @returns       an object or array.
 */
export function from(
  desc: Description,
  assignValue = defaultAssignValue,
  assignStructure = defaultAssignStructure
): any {
  const result = new desc.Ctor();
  const all: Values = (desc.structures || [])
    // @ts-ignore
    .concat(desc.values)
    .concat(desc.references || []);

  for (const { path, Ctor, value, target } of all) {
    let node = result;
    for (let index = 0; index < path.length; index++) {
      const key = path[index];

      if (index !== path.length - 1) {
        if (!desc.structures && !node[key]) {
          node[key] = Number.isInteger(path[index + 1] as number) ? [] : {};
        }
        node = node[key];
      } else {
        if (Ctor) {
          assignStructure(node, key, Ctor);
        } else if (target) {
          const targetedValue = getByPath(target, result);
          if (targetedValue !== undefined) {
            assignValue(node, key, targetedValue);
          }
        } else {
          assignValue(node, key, value);
        }
      }
    }
  }

  return result;
}

/**
 * Retrieve the value at a given path.
 *
 * @param paths   The path to use.
 * @param obj     The object to retrieve the nested property from.
 * @returns       The data at `path`.
 *
 * @source: https://github.com/ramda/ramda/blob/v0.25.0/source/path.js
 */
function getByPath(paths, obj) {
  let val = obj;
  let idx = 0;
  while (idx < paths.length) {
    if (val == null) {
      return;
    }
    val = val[paths[idx]];
    idx += 1;
  }
  return val;
}
