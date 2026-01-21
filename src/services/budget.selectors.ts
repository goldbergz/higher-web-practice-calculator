import { BudgetState } from '../models/budget/budget.types';
import { Expense } from '../models/expense/expense.types';
import { DateUtils } from '../utils/date.utils';

export class BudgetSelectors {
  static totalExpenses(state: BudgetState): number {
    return state.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  static remainingBalance(state: BudgetState): number {
    return state.budget ? state.budget.initialBalance - this.totalExpenses(state) : 0;
  }

  static daysLeft(state: BudgetState): number {
    return state.budget ? DateUtils.daysFromToday(state.budget.endDate) : 0;
  }

  static perDayLimit(state: BudgetState): number {
    const days = this.daysLeft(state);
    if (!days || !state.budget) return 0;

    return Math.round((this.remainingBalance(state) / days) * 10) / 10;
  }

  static todayExpenses(state: BudgetState): Expense[] {
    const today = DateUtils.startOfDay();
    return state.expenses.filter(e => DateUtils.startOfDay(e.date).getTime() === today.getTime());
  }

  static todayAvailable(state: BudgetState): number {
    if (!state.budget) return 0;
    const spentToday = this.todayExpenses(state).reduce((sum, e) => sum + e.amount, 0);
    return state.budget.dailyLimit - spentToday;
  }

  static adjustedDailyAvailable(state: BudgetState): number {
    const todayAvailable = this.todayAvailable(state);
    if (!state.budget) return 0;

    return todayAvailable < 0
      ? Math.max(state.budget.dailyLimit + todayAvailable, 0)
      : state.budget.dailyLimit;
  }

  static dailyFeedback(state: BudgetState): string {
    const todayAvailable = this.todayAvailable(state);
    return todayAvailable > 0
      ? '🎉 Отлично справились — сегодня вы в пределах лимита!'
      : 'К сожалению, сегодня не получилось вписаться в лимит.';
  }

  static averageTodayExpense(state: BudgetState): number {
    const expenses = BudgetSelectors.todayExpenses(state);
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return Math.round((total / expenses.length) * 10) / 10;
  }
}
