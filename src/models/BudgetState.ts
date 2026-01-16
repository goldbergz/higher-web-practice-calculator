import { State } from './State';
import { Expense } from './ZodSchema';

export interface AppState {
  initialBalance: number;
  endDate: Date | null;
  dailyAmount: number;
  expenses: Expense[];
}

const initialState: AppState = {
  initialBalance: 0,
  endDate: null,
  dailyAmount: 0,
  expenses: [],
};

class BudgetState extends State<AppState> {
  setBudget(balance: number, endDate: Date): void {
    const days = Math.max(Math.ceil((endDate.getTime() - Date.now()) / 86400000), 1);
    this.setState({
      initialBalance: balance,
      endDate,
      dailyAmount: Math.floor(balance / days),
      expenses: [],
    });
  }

  addExpense(expense: Expense): void {
    this.setState(state => ({
      expenses: [...state.expenses, expense],
    }));
  }

  getTotalExpenses(): number {
    return this.getState().expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  getRemainingBalance(): number {
    const { initialBalance } = this.getState();
    return initialBalance - this.getTotalExpenses();
  }
}

export const budgetState = new BudgetState(initialState);
