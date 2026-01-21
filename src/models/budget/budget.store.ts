import { State } from '../../utils/State';
import { BudgetState, Budget } from './budget.types';
import { Expense } from '../expense/expense.types';

const initialState: BudgetState = {
  budget: null,
  expenses: [],
};

export class BudgetStore extends State<BudgetState> {
  constructor() {
    super(initialState);
  }

  setBudget(budget: Budget) {
    this.setState({ budget, expenses: [] });
  }

  updateBudget(budget: Budget) {
    this.setState(state => ({ ...state, budget }));
  }

  setExpenses(expenses: Expense[]) {
    this.setState({ expenses });
  }

  addExpense(expense: Expense) {
    this.setState(s => ({ expenses: [...s.expenses, expense] }));
  }

  removeExpense(id: number) {
    this.setState(s => ({
      expenses: s.expenses.filter(e => e.id !== id),
    }));
  }
}
