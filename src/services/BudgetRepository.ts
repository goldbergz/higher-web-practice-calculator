import { dbPromise, BUDGET_STORE, EXPENSE_STORE } from '../utils/IndexedDB';
import { Budget, Expense } from '../utils/ZodSchema';

const BUDGET_ID = 'main';

export class BudgetRepository {
  async saveBudget(budget: Budget & { dailyAmount: number }) {
    const db = await dbPromise;
    return db.put(BUDGET_STORE, { id: BUDGET_ID, ...budget });
  }

  async getBudget() {
    const db = await dbPromise;
    return db.get(BUDGET_STORE, BUDGET_ID);
  }

  async addExpense(expense: Expense) {
    const db = await dbPromise;
    return db.add(EXPENSE_STORE, expense);
  }

  async getExpenses(): Promise<Expense[]> {
    const db = await dbPromise;
    return db.getAll(EXPENSE_STORE);
  }

  async clearExpenses() {
    const db = await dbPromise;
    return db.clear(EXPENSE_STORE);
  }

  async deleteExpense(id: number) {
    const db = await dbPromise;
    return db.delete(EXPENSE_STORE, id);
  }
}
