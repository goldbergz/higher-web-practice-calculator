import { State } from '../utils/State';
import { Expense } from '../utils/ZodSchema';
import { BudgetRepository } from '../services/BudgetRepository';

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
  private repo = new BudgetRepository();
  async init() {
    const budget = await this.repo.getBudget();
    const expenses = await this.repo.getExpenses();

    if (!budget) return;

    this.setState(
      {
        initialBalance: budget.initialBalance,
        endDate: new Date(budget.endDate),
        dailyAmount: budget.dailyAmount,
        expenses,
      },
      true
    );
  }

  async setBudget(balance: number, endDate: Date): Promise<void> {
    const days = Math.max(Math.ceil((endDate.getTime() - Date.now()) / 86400000), 1);
    const dailyAmount = Math.floor(balance / days);

    await this.repo.saveBudget({
      initialBalance: balance,
      endDate,
      dailyAmount,
    });

    await this.repo.clearExpenses();

    this.setState({
      initialBalance: balance,
      endDate,
      dailyAmount,
      expenses: [],
    });
  }

  async updateBudget(balance: number, endDate: Date): Promise<void> {
    const days = Math.max(Math.ceil((endDate.getTime() - Date.now()) / 86400000), 1);

    const dailyAmount = Math.floor(balance / days);

    await this.repo.saveBudget({
      initialBalance: balance,
      endDate,
      dailyAmount,
    });

    this.setState(state => ({
      ...state,
      initialBalance: balance,
      endDate,
      dailyAmount,
    }));
  }

  async addExpense(expense: Expense): Promise<void> {
    const id = await this.repo.addExpense(expense);
    console.log('IDB expense id:', id);

    this.setState(state => ({
      expenses: [...state.expenses, { ...expense, id }],
    }));
  }

  getTotalExpenses(): number {
    return this.getState().expenses.reduce((sum, e) => sum + e.amount, 0);
  }

  getRemainingBalance(): number {
    const { initialBalance } = this.getState();
    return initialBalance - this.getTotalExpenses();
  }

  async deleteExpense(id: number): Promise<void> {
    await this.repo.deleteExpense(id);

    this.setState(state => ({
      expenses: state.expenses.filter(e => e.id !== id),
    }));
  }
}

export const budgetState = new BudgetState(initialState);
