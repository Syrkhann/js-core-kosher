import { describe, expect, it } from 'vitest';
import { Store, SortedStore } from '../src/Store.js';

const products = [
  { id: 1, name: 'Keyboard', price: 30000, category: 'tech' },
  { id: 2, name: 'Book', price: 5000, category: 'education' },
  { id: 3, name: 'Mouse', price: 15000, category: 'tech' }
];

describe('Store', () => {
  it('adds an item', () => {
    const store = new Store();
    store.add(products[0]);

    expect(store.count).toBe(1);
    expect(store.items[0]).toEqual(products[0]);
  });

  it('removes an item by id', () => {
    const store = new Store(products);

    expect(store.remove(2)).toBe(true);
    expect(store.count).toBe(2);
    expect(store.remove(99)).toBe(false);
  });

  it('finds items with a predicate', () => {
    const store = new Store(products);

    expect(store.find((item) => item.category === 'tech')).toHaveLength(2);
  });

  it('calculates the total price', () => {
    const store = new Store(products);

    expect(store.total()).toBe(50000);
  });

  it('returns zero total for an empty store', () => {
    expect(new Store().total()).toBe(0);
  });

  it('uses the static from method', () => {
    const store = Store.from(products);

    expect(store).toBeInstanceOf(Store);
    expect(store.count).toBe(3);
  });

  it('uses private state through public getters', () => {
    const store = new Store(products);
    const items = store.items;

    items.pop();

    expect(store.count).toBe(3);
  });

  it('rejects a wrong item type', () => {
    const store = new Store();

    expect(() => store.add('book')).toThrow(TypeError);
  });
});

describe('SortedStore', () => {
  it('inherits Store and sorts find results by price', () => {
    const store = new SortedStore(products);
    const result = store.find(() => true);

    expect(result.map((item) => item.price)).toEqual([5000, 15000, 30000]);
  });

  it('uses super.find in the overridden method', () => {
    const store = new SortedStore(products);
    const result = store.find((item) => item.category === 'tech');

    expect(result.map((item) => item.name)).toEqual(['Mouse', 'Keyboard']);
  });
});
