import { openDB } from 'idb';

export const DB_NAME = 'BudgetDB';
export const DB_VERSION = 1;

export const BUDGET_STORE = 'budget';
export const EXPENSE_STORE = 'expenses';

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(BUDGET_STORE)) {
      db.createObjectStore(BUDGET_STORE, { keyPath: 'id' });
    }

    if (!db.objectStoreNames.contains(EXPENSE_STORE)) {
      const store = db.createObjectStore(EXPENSE_STORE, {
        keyPath: 'id',
        autoIncrement: true,
      });
      store.createIndex('date', 'date');
    }
  },
});
