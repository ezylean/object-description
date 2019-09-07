import { Description, Path } from './description';

type Values = Array<{
  path: Path;
  value?: any;
  target?: Path;
}>;

/**
 * Convert an object/array description in it's exact representation.
 *
 * ### Example
 * ```js
 * import { from as fromDescription } from '@ezy/object-description'
 * console.log(fromDescription({
 *  is_array: false,
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
export function from({ is_array, values, references }: Description): any {
  const result = is_array ? [] : {};
  const valuesAndRefs: Values = (values as Values).concat(references || []);

  for (const { path, value, target } of valuesAndRefs) {
    let node = result;
    for (let index = 0; index < path.length; index++) {
      const key = path[index];

      if (index !== path.length - 1) {
        if (!node[key]) {
          node[key] = Number.isInteger(path[index + 1] as number) ? [] : {};
        }
        node = node[key];
      } else {
        if (target) {
          const targetedValue = getByPath(target, result);
          if (targetedValue !== undefined) {
            node[key] = targetedValue;
          }
        } else {
          node[key] = value;
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
