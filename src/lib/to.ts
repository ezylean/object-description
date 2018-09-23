import { Description } from './description';
/**
 * check if a given value is a javascript primitive
 */
function isPrimitive(value) {
  return value !== Object(value);
}

/**
 * check if a given value is actually an array
 */
const isArray = Array.isArray;

/**
 * Convert any object/array into an array of path-value
 *
 * ### Example
 * ```js
 * import { to as toDescription } from '@ezy/object-description'
 * console.log(toDescription({
 *    value: true,
 *    lvl1: {
 *       lvl2: [
 *           [undefined, { 50: false }]
 *      ]
 *   }
 * }))
 * // => {
 * // is_array: false,
 * // primitives: [
 * //   { path: ['value'], value: true },
 * //   { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
 * // ]
 * //}
 * ```
 *
 * @param value   an object or array.
 * @returns       array of path value.
 */
export function to(value: any): Description {
  const primitives: Array<{ path: Array<string | number>; value: any }> = [];
  const nodes = [{ path: [] as Array<string | number>, value }];

  while (nodes.length > 0) {
    const node = nodes.pop();

    for (const key in node.value) {
      if (node.value.hasOwnProperty(key)) {
        const path = node.path.concat(isArray(node.value) ? Number(key) : key);
        const primitive = { path, value: node.value[key] };

        if (!isPrimitive(primitive.value)) {
          nodes.unshift(primitive);
        } else if (primitive.value !== undefined) {
          primitives.push(primitive);
        }
      }
    }
  }

  return {
    is_array: isArray(value),
    primitives
  };
}
