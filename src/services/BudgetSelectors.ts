import { AppState } from '../models/BudgetState';
import { Expense } from '../utils/ZodSchema';

const DAY = 86400000;

const round = (value: number): number =>
  Math.round(value * 10) / 10;

export class BudgetSelectors {
  static totalExpenses(state: AppState): number {
    return state.expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  static remainingBalance(state: AppState): number {
    return state.initialBalance - this.totalExpenses(state);
  }

  static daysLeft(state: AppState): number {
    if (!state.endDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(state.endDate);
    end.setHours(0, 0, 0, 0);

    return Math.max(Math.ceil((end.getTime() - today.getTime()) / DAY), 1);
  }

  static perDayLimit(state: AppState): number {
    const days = this.daysLeft(state);
    if (!days) return 0;

    return round(this.remainingBalance(state) / days);
  }

  static dailyAvailable(state: AppState): number {
    return state.dailyAmount;
  }

  static todayAvailable(state: AppState): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const spentToday = state.expenses
      .filter(e => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === today.getTime();
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return state.dailyAmount - spentToday;
  }

  static todayExpenses(state: AppState): Expense[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      expenseDate.setHours(0, 0, 0, 0);
      return expenseDate.getTime() === today.getTime();
    });
  }

  static averageTodayExpense(state: AppState): number {
    const expenses = BudgetSelectors.todayExpenses(state);
    if (expenses.length === 0) return 0;
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    return round(total / expenses.length);
  }

  static adjustedDailyAvailable(state: AppState): number {
    const todayAvailable = this.todayAvailable(state);
    const dailyAvailable = this.dailyAvailable(state);
    return todayAvailable < 0
      ? round(Math.max(dailyAvailable + todayAvailable, 0))
      : round(dailyAvailable);
  }

  static dailyFeedback(state: AppState): string {
    const todayAvailable = this.todayAvailable(state);
    return todayAvailable > 0
      ? '🎉 Отлично справились — сегодня вы в пределах лимита!'
      : 'К сожалению, сегодня не получилось вписаться в лимит.';
  }
};
