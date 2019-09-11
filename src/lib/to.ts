import { Description, Path } from './description';

/**
 * check if a given value is a literal Object or an Array
 */
function defaultIsValue(value) {
  const type = Object.prototype.toString.call(value).slice(8, -1);
  return (
    (type !== 'Array' && type !== 'Object') ||
    (type === 'Object' && value.constructor !== Object)
  );
}

/**
 * Convert any object/array into a description object
 * with all values values and their associated path.
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
 * // Ctor: Object,
 * // values: [
 * //   { path: ['value'], value: true },
 * //   { path: ['lvl1', 'lvl2', 0, 1, '50'], value: false }
 * // ]
 * //}
 * ```
 *
 * @param value   an object or array.
 * @param isValue a function to check if the given object or primitive should be considered as a value (Optional)
 * @returns       a description object.
 */
export function to(
  value: any,
  complete = false,
  isValue = defaultIsValue
): Description {
  const values: Array<{ path: Path; value: any }> = [];
  const references: Array<{ path: Path; target: Path }> = [];
  const structures: Array<{ path: Path; Ctor: new () => any }> = [];

  const memory = new Map<any, Path>();
  memory.set(value, []);

  const nodes = [{ path: [] as Path, value }];

  while (nodes.length > 0) {
    const currentNode = nodes.pop();

    for (const key in currentNode.value) {
      if (currentNode.value.hasOwnProperty(key)) {
        const path = currentNode.path.concat(
          Array.isArray(currentNode.value) ? Number(key) : key
        );
        const node = { path, value: currentNode.value[key] };

        if (memory.has(node.value)) {
          references.push({ path: node.path, target: memory.get(node.value) });
        } else {
          if (!isValue(node.value)) {
            nodes.unshift(node);
            memory.set(node.value, node.path);
            if (complete) {
              structures.push({
                Ctor: node.value.constructor,
                path: node.path
              });
            }
          } else if (node.value !== undefined) {
            values.push(node);
          }
        }
      }
    }
  }

  memory.clear();

  const description: Description = {
    values
  };

  if (complete) {
    structures.unshift({ path: [], Ctor: value.constructor });
    description.structures = structures;
  } else {
    description.Ctor = value.constructor;
  }

  if (references.length > 0) {
    description.references = references;
  }

  return description;
}
