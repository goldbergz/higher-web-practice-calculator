import { BudgetStore } from '../models/budget/budget.store';
import { BudgetRepository } from './budget.repository';
import { Budget } from '../models/budget/budget.types';
import { Expense } from '../models/expense/expense.types';
import { DateUtils } from '../utils/date.utils';

export class BudgetService {
  constructor(
    private store: BudgetStore,
    private repo: BudgetRepository
  ) {}

  async init(): Promise<void> {
    const budget = await this.repo.getBudget();
    const expenses = await this.repo.getExpenses();
    if (!budget) return;

    this.store.setBudget(budget);
    this.store.setExpenses(expenses);
  }

  calculateDailyLimit(balance: number, endDate: Date): number {
    const days = DateUtils.daysFromToday(endDate);
    return Math.floor(balance / days);
  }

  async addExpense(expense: Expense): Promise<void> {
    const id = await this.repo.addExpense(expense);
    this.store.addExpense({ ...expense, id: Number(id) });
  }

  async deleteExpense(id: number): Promise<void> {
    await this.repo.deleteExpense(id);

    this.store.removeExpense(id);
  }

  async updateBudget(budget: Budget): Promise<void> {
    const dailyAmount = this.calculateDailyLimit(budget.initialBalance, budget.endDate);
    const budgetToSave = { ...budget, dailyAmount };

    await this.repo.saveBudget(budgetToSave);
    this.store.updateBudget(budgetToSave);
  }

  async setBudget(budget: Budget): Promise<void> {
    const dailyAmount = this.calculateDailyLimit(budget.initialBalance, budget.endDate);
    const budgetToSave = { ...budget, dailyAmount };

    await this.repo.saveBudget(budgetToSave);
    await this.repo.clearExpenses();
    this.store.setBudget(budgetToSave);
  }

  getTotalExpenses(): number {
    return this.store.getState().expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  getRemainingBalance(): number {
    const state = this.store.getState();
    if (!state.budget) return 0;
    return state.budget.initialBalance - this.getTotalExpenses();
  }
}
