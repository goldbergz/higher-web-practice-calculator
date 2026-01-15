import { State } from './State';
import { Expense } from './ZodSchema';

export interface AppState {
  initialBalance: number;
  endDate: Date | null;
  expenses: Expense[];
}

const initialState: AppState = {
  initialBalance: 0,
  endDate: null,
  expenses: [],
};

class BudgetState extends State<AppState> {
  setBudget(balance: number, endDate: Date): void {
    this.setState({
      initialBalance: balance,
      endDate,
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
