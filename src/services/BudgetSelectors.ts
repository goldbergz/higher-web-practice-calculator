import { AppState } from '../models/BudgetState';

const DAY = 86400000;

export const BudgetSelectors = {
  totalExpenses(state: AppState): number {
    return state.expenses.reduce((sum, e) => sum + e.amount, 0);
  },

  remainingBalance(state: AppState): number {
    return state.initialBalance - this.totalExpenses(state);
  },

  daysLeft(state: AppState): number {
    if (!state.endDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(state.endDate);
    end.setHours(0, 0, 0, 0);

    return Math.max(Math.ceil((end.getTime() - today.getTime()) / DAY), 1);
  },

  perDayLimit(state: AppState): number {
    const days = this.daysLeft(state);
    if (!days) return 0;

    return Math.floor(this.remainingBalance(state) / days);
  },

  dailyAvailable(state: AppState): number {
    return state.dailyAmount;
  },
  todayAvailable(state: AppState): number {
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
  },
};
