/**
 * Store keeps a private collection of items.
 * Each item should have an id and can optionally have a numeric price.
 */
export class Store {
  #items;

  constructor(items = []) {
    if (!Array.isArray(items)) {
      throw new TypeError('Store expects an array');
    }

    this.#items = [...items];
  }

  add(item) {
    if (item === null || typeof item !== 'object') {
      throw new TypeError('Store item must be an object');
    }

    this.#items.push({ ...item });
    return item;
  }

  remove(id) {
    const index = this.#items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    this.#items.splice(index, 1);
    return true;
  }

  find(predicate) {
    if (typeof predicate !== 'function') {
      throw new TypeError('find expects a function');
    }

    return this.#items.filter(predicate);
  }

  total() {
    return this.#items.reduce(
      (sum, { price = 0 }) => sum + (typeof price === 'number' ? price : 0),
      0
    );
  }

  get items() {
    return this.#items.map((item) => ({ ...item }));
  }

  get count() {
    return this.#items.length;
  }

  static from(items) {
    return new Store(items);
  }
}

/**
 * Store with find results sorted by price.
 */
export class SortedStore extends Store {
  find(predicate) {
    const result = super.find(predicate);

    return [...result].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  }
}
