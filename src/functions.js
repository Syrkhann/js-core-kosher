/**
 * Return an array with duplicate values removed.
 * @param {Array} arr
 * @returns {Array}
 */
export function unique(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('unique expects an array');
  }

  return [...new Set(arr)];
}

/**
 * Group array items by a key calculated by keyFn.
 * @param {Array} arr
 * @param {Function} keyFn
 * @returns {Object}
 */
export function groupBy(arr, keyFn) {
  if (!Array.isArray(arr)) {
    throw new TypeError('groupBy expects an array');
  }
  if (typeof keyFn !== 'function') {
    throw new TypeError('groupBy expects a function as keyFn');
  }

  return arr.reduce((groups, item) => {
    const key = keyFn(item);
    return {
      ...groups,
      [key]: [...(groups[key] ?? []), item]
    };
  }, {});
}

/**
 * Split an array into chunks of the requested size.
 * @param {Array} arr
 * @param {number} size
 * @returns {Array[]}
 */
export function chunk(arr, size) {
  if (!Array.isArray(arr)) {
    throw new TypeError('chunk expects an array');
  }
  if (!Number.isInteger(size) || size <= 0) {
    throw new RangeError('chunk size must be a positive integer');
  }

  return arr.reduce((chunks, _, index) => {
    if (index % size === 0) {
      chunks.push(arr.slice(index, index + size));
    }
    return chunks;
  }, []);
}

/**
 * Deep clone common JavaScript values without JSON serialization.
 * @param {*} value
 * @returns {*}
 */
export function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (value instanceof Map) {
    const clonedMap = new Map();
    seen.set(value, clonedMap);
    value.forEach((mapValue, mapKey) => {
      clonedMap.set(deepClone(mapKey, seen), deepClone(mapValue, seen));
    });
    return clonedMap;
  }

  if (value instanceof Set) {
    const clonedSet = new Set();
    seen.set(value, clonedSet);
    value.forEach((item) => clonedSet.add(deepClone(item, seen)));
    return clonedSet;
  }

  if (seen.has(value)) {
    return seen.get(value);
  }

  const clone = Array.isArray(value)
    ? []
    : Object.create(Object.getPrototypeOf(value));

  seen.set(value, clone);

  for (const key of Reflect.ownKeys(value)) {
    clone[key] = deepClone(value[key], seen);
  }

  return clone;
}

/**
 * Cache function results using a closure.
 * @param {Function} fn
 * @returns {Function}
 */
export function memoize(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('memoize expects a function');
  }

  const cache = new Map();

  return (...args) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Factory that returns functions sharing private state through a closure.
 * @param {number} initial
 * @returns {{inc: Function, dec: Function, value: Function}}
 */
export function counter(initial = 0) {
  if (typeof initial !== 'number' || Number.isNaN(initial)) {
    throw new TypeError('counter initial value must be a number');
  }

  let current = initial;

  const inc = (amount = 1) => {
    current += amount;
    return current;
  };

  const dec = (amount = 1) => {
    current -= amount;
    return current;
  };

  const value = () => current;

  return { inc, dec, value };
}
