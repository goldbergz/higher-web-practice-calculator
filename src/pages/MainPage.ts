import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { BudgetStore } from '../models/budget/budget.store';
import { BudgetService } from '../services/budget.service';
import { Expense } from '../models/expense/expense.types';
import { ExpenseValidator } from '../services/validation.service';
import { showFormErrors } from '../services/errors.service';
import { renderExpensesList } from '../components/ExpenseList';
import { BudgetSelectors } from '../services/budget.selectors';

export class MainPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(
    private router: Router,
    private store: BudgetStore,
    private service: BudgetService
  ) {
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
    const todayAverageElement = document.getElementById('avarage-expense-main') as HTMLElement;
    const feedbackElement = document.getElementById('daily-feedback') as HTMLElement;

    const blockList = document.getElementById('history-block-list') as HTMLUListElement | null;

    const render = () => {
      const state = this.store.getState();
      if (!state.budget) return;

      totalBalanceElement.textContent = `${state.budget.initialBalance} ₽`;
      daysInfoElement.textContent = `на ${BudgetSelectors.daysLeft(state)} дней`;
      todayAvailableElement.textContent = `${BudgetSelectors.todayAvailable(state)} ₽`;
      dailyAmountElement.textContent = `${state.budget.dailyLimit} ₽ в день`;
      dailyAvailableElement.textContent = `${BudgetSelectors.adjustedDailyAvailable(state)} ₽`;
      todayAverageElement.textContent = `Средние траты в день: ${BudgetSelectors.averageTodayExpense(state)} ₽`;
      feedbackElement.textContent = BudgetSelectors.dailyFeedback(state);

      const lastThree = state.expenses.slice(-3).reverse();
      renderExpensesList(blockList, lastThree, this.service);
    };

    render();
    this.unsubscribe = this.store.subscribe(render);

    expenseInput.addEventListener('input', () => {
      document.getElementById('expense-error')!.textContent = '';
    });

    form.onsubmit = async e => {
      e.preventDefault();
      const expense: Expense = { amount: Number(expenseInput.value), date: new Date() };
      const result = ExpenseValidator.validate(expense);

      if (!result.success) {
        showFormErrors(result.error, 'main');
        return;
      }
      await this.service.addExpense(expense);
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
