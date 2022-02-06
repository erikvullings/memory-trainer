/**
 * Original author: fuzetsu
 * Source: https://github.com/fuzetsu/mergerino
 */

export const assign =
  Object.assign ||
  ((a: any, b: any) => (b && Object.keys(b).forEach(k => (a[k] = b[k])), a));

const run = (isArr: boolean, copy: any, patch: any) => {
  const type = typeof patch;
  if (patch && type === 'object') {
    if (Array.isArray(patch)) {
      for (const p of patch) {
        copy = run(isArr, copy, p);
      }
    } else {
      for (const k of Object.keys(patch)) {
        const val = patch[k];
        if (typeof val === 'function') {
          copy[k] = val(copy[k], merge);
        } else if (val === undefined) {
          isArr && !isNaN(+k) ? copy.splice(k, 1) : delete copy[k];
        } else if (
          val === null ||
          typeof val !== 'object' ||
          Array.isArray(val)
        ) {
          copy[k] = val;
        } else if (typeof copy[k] === 'object') {
          copy[k] = val === copy[k] ? val : merge(copy[k], val);
        } else {
          copy[k] = run(false, {}, val);
        }
      }
    }
  } else if (type === 'function') {
    copy = patch(copy, merge);
  }
  return copy;
};

export type ValueOf<U> = U[keyof U];

/**
 * Object.assign supercharged, supporting:
 * - Deep patching
 * - Patching based on the current value
 * - Deleting properties that are undefined
 *
 * @author Original author, Daniel Loomer, https://github.com/fuzetsu
 * @author TypeScript version, Erik Vullings, https://github.com/erikvullings
 * @param source
 * @param patches
 */
export const merge = <T extends {}, U>(source: T | T[], ...patches: U[]) => {
  const isArr = Array.isArray(source);
  return run(
    isArr,
    isArr ? (source as T[]).slice() : assign({}, source),
    patches
  );
};
// export const merge = <T extends {}, K extends keyof T>(
//   source: T | T[],
//   ...patches: Array<Partial<T> | { [P in K]?: (v: T[P]) => T[P] }>
// ) => {
