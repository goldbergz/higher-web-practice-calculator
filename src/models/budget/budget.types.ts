import { Expense } from '../expense/expense.types';

export interface Budget {
  initialBalance: number;
  endDate: Date;
  dailyLimit: number;
}

export interface BudgetState {
  budget: Budget | null;
  expenses: Expense[];
}

export type Deposit = {
  deposit: number;
};
