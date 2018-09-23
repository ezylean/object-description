import { Description } from './description';

/**
 * Convert an array of path-value in it's exact object/array representation
 *
 * ### Example
 * ```js
 * import { from as fromDescription } from '@ezy/object-description'
 * console.log(fromDescription({
 *  is_array: false,
 *  primitives: [
 *   { path: ['value'], value: true },
 *   { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
 * ]
 * }))
 * // => { value: true, lvl1: { lvl2: [ [ undefined, { '50': false } ] ] } }
 * ```
 *
 * @param value   array of path value.
 * @returns       an object or array.
 */
export function from(description: Description): any {
  const result = description.is_array ? [] : {};

  for (const { path, value } of description.primitives) {
    let node = result;
    for (let index = 0; index < path.length; index++) {
      const key = path[index];

      if (index !== path.length - 1) {
        if (!node[key]) {
          node[key] = Number.isInteger(path[index + 1] as number) ? [] : {};
        }
        node = node[key];
      } else {
        node[key] = value;
      }
    }
  }

  return result;
}
