import "@testing-library/jest-dom/vitest";

const createMemoryStorage = () => {
  const items = new Map();

  return {
    clear: () => items.clear(),
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    key: (index) => [...items.keys()][index] ?? null,
    removeItem: (key) => items.delete(key),
    setItem: (key, value) => items.set(key, String(value)),
    get length() {
      return items.size;
    }
  };
};

const storage = createMemoryStorage();

Object.defineProperty(globalThis, "localStorage", {
  configurable: true,
  value: storage
});
Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: storage
});
