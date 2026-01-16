import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { ExpenseValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../utils/formErrors';
import { budgetState } from '../models/BudgetState';
import { BudgetSelectors } from '../services/BudgetSelectors';
import { renderExpensesList } from '../services/ExpensesRenderer';

export class MainPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(private router: Router) {
    super('main-page');
  }
  protected onShow(): void {
    const form = document.getElementById('add-expense') as HTMLFormElement;
    const expenseInput = document.getElementById('expense-input') as HTMLInputElement;

    const totalBalanceElement = document.querySelector('.balance__main-content h2') as HTMLElement;
    const daysInfoElement = document.querySelector('.balance__main-content span') as HTMLElement;
    const todayAvailableElement = document.getElementById('available-sum') as HTMLElement;
    const dailyAmountElement = document.getElementById('daily-amount') as HTMLElement;
    const dailyAvailableElement = document.getElementById('available-daily-sum') as HTMLElement;

    const blockList = document.getElementById('history-block-list') as HTMLUListElement | null;

    const renderExpenses = () => {
      const { expenses } = budgetState.getState();
      console.log(expenses);
      renderExpensesList(blockList, expenses);
    };

    const render = () => {
      const state = budgetState.getState();
      totalBalanceElement.textContent = `${state.initialBalance} ₽`;
      daysInfoElement.textContent = `на ${BudgetSelectors.daysLeft(state)} дней`;
      todayAvailableElement.textContent = `${BudgetSelectors.todayAvailable(state)} ₽`;
      dailyAmountElement.textContent = `${state.dailyAmount} ₽ в день`;
      dailyAvailableElement.textContent = `${state.dailyAmount} ₽`;

      renderExpenses();
    };

    render();
    this.unsubscribe = budgetState.subscribe(render);
    form.onsubmit = e => {
      e.preventDefault();
      const expense = {
        amount: Number(expenseInput.value),
        date: new Date(),
      };
      console.log(expense);

      const result = ExpenseValidator.validate(expense);
      console.log(result);
      if (!result.success) {
        showFormErrors(result.error, 'main');
        return;
      }
      budgetState.addExpense(expense);
      expenseInput.value = '';
    };

    document.getElementById('view-all-history-btn')?.addEventListener('click', () => {
      this.router.navigate('history');
    });

    document.querySelector('.button-history')?.addEventListener('click', () => {
      this.router.navigate('history');
    });

    document.querySelector('.button-edit')?.addEventListener('click', () => {
      this.router.navigate('edit');
    });
  }

  protected onHide(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
