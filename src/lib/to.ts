import { Description, Path } from './description';

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
 * Convert any object/array into a description object
 * with all primitives values and their associated path.
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
 * // primitives: [
 * //   { path: ['value'], value: true },
 * //   { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
 * // ]
 * //}
 * ```
 *
 * @param value   an object or array.
 * @returns       a description object.
 */
export function to(value: any): Description {
  const primitives: Array<{ path: Path; value: any }> = [];
  const references: Array<{ path: Path; target: Path }> = [];

  const memory = new Map<any, Path>();
  memory.set(value, []);

  const nodes = [{ path: [] as Path, value }];

  while (nodes.length > 0) {
    const currentNode = nodes.pop();

    for (const key in currentNode.value) {
      if (currentNode.value.hasOwnProperty(key)) {
        const path = currentNode.path.concat(
          isArray(currentNode.value) ? Number(key) : key
        );
        const node = { path, value: currentNode.value[key] };

        if (memory.has(node.value)) {
          references.push({ path: node.path, target: memory.get(node.value) });
        } else if (!isPrimitive(node.value)) {
          nodes.unshift(node);
          memory.set(node.value, node.path);
        } else if (node.value !== undefined) {
          primitives.push(node);
        }
      }
    }
  }

  memory.clear();

  const description: Description = { primitives };

  if (isArray(value)) {
    description.is_array = true;
  }

  if (references.length > 0) {
    description.references = references;
  }

  return description;
}
