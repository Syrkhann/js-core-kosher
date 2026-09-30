import { describe, expect, it, vi } from 'vitest';
import {
  unique,
  groupBy,
  chunk,
  deepClone,
  memoize,
  counter
} from '../src/functions.js';

describe('unique', () => {
  it('removes duplicate values', () => {
    expect(unique([1, 2, 2, 3, 1])).toEqual([1, 2, 3]);
  });

  it('handles an empty array', () => {
    expect(unique([])).toEqual([]);
  });

  it('throws for a wrong type', () => {
    expect(() => unique('123')).toThrow(TypeError);
  });
});

describe('groupBy', () => {
  const users = [
    { name: 'A', role: 'student' },
    { name: 'B', role: 'teacher' },
    { name: 'C', role: 'student' }
  ];

  it('groups objects by a computed key', () => {
    expect(groupBy(users, (user) => user.role)).toEqual({
      student: [users[0], users[2]],
      teacher: [users[1]]
    });
  });

  it('handles an empty array', () => {
    expect(groupBy([], (item) => item)).toEqual({});
  });

  it('throws when keyFn is not a function', () => {
    expect(() => groupBy(users, 'role')).toThrow(TypeError);
  });
});

describe('chunk', () => {
  it('splits an array into pieces', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([
      [1, 2],
      [3, 4],
      [5]
    ]);
  });

  it('handles an empty array', () => {
    expect(chunk([], 2)).toEqual([]);
  });

  it('handles size equal to one', () => {
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });

  it('rejects zero as a chunk size', () => {
    expect(() => chunk([1, 2], 0)).toThrow(RangeError);
  });

  it('rejects a wrong array type', () => {
    expect(() => chunk('123', 2)).toThrow(TypeError);
  });
});

describe('deepClone', () => {
  it('creates an independent nested copy', () => {
    const original = { user: { name: 'Syrkhan' }, scores: [1, 2] };
    const clone = deepClone(original);

    clone.user.name = 'Other';
    clone.scores.push(3);

    expect(original).toEqual({
      user: { name: 'Syrkhan' },
      scores: [1, 2]
    });
  });

  it('clones Date values', () => {
    const original = new Date('2026-01-01T00:00:00.000Z');
    const clone = deepClone(original);

    expect(clone).not.toBe(original);
    expect(clone.getTime()).toBe(original.getTime());
  });

  it('returns primitive values unchanged', () => {
    expect(deepClone(0)).toBe(0);
    expect(deepClone(null)).toBeNull();
  });
});

describe('memoize', () => {
  it('returns the same calculated result for the same arguments', () => {
    const fn = vi.fn((a, b) => a + b);
    const cached = memoize(fn);

    expect(cached(2, 3)).toBe(5);
    expect(cached(2, 3)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('calculates different arguments separately', () => {
    const fn = vi.fn((n) => n * 2);
    const cached = memoize(fn);

    expect(cached(2)).toBe(4);
    expect(cached(3)).toBe(6);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('throws for a non-function', () => {
    expect(() => memoize(42)).toThrow(TypeError);
  });
});

describe('counter', () => {
  it('keeps private state through a closure', () => {
    const count = counter();

    expect(count.value()).toBe(0);
    expect(count.inc()).toBe(1);
    expect(count.inc(2)).toBe(3);
    expect(count.dec()).toBe(2);
  });

  it('supports zero as an initial value', () => {
    const count = counter(0);
    expect(count.value()).toBe(0);
  });

  it('rejects a wrong initial type', () => {
    expect(() => counter('0')).toThrow(TypeError);
  });
});
