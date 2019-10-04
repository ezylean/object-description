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
  destination?: any,
  assignValue = defaultAssignValue,
  assignStructure = defaultAssignStructure
): any {
  const holder = {
    result: destination
  };

  const structures = desc.structures || [];

  if (desc.Ctor && (!structures[0] || structures[0].path.length !== 0)) {
    structures.unshift({ path: [], Ctor: desc.Ctor });
  }

  const all: Values = structures
    // @ts-ignore
    .concat(desc.values)
    .concat(desc.references || []);

  for (const { path, Ctor, value, target } of all) {
    let node = holder;
    for (let index = -1; index < path.length; index++) {
      const key = index === -1 ? 'result' : path[index];

      if (index !== path.length - 1) {
        if (!node[key]) {
          node[key] = Number.isInteger(path[index + 1] as number) ? [] : {};
        }
        node = node[key];
      } else {
        if (Ctor && (!node[key] || node[key].constructor !== Ctor)) {
          assignStructure(node, key, Ctor);
        } else if (target) {
          const targetedValue = getByPath(target, holder.result);
          if (targetedValue !== undefined) {
            assignValue(node, key, targetedValue);
          }
        } else {
          assignValue(node, key, value);
        }
      }
    }
  }

  return holder.result;
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
