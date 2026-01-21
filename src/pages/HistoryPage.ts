import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { BudgetStore } from '../models/budget/budget.store';
import { BudgetSelectors } from '../services/budget.selectors';
import { BudgetService } from '../services/budget.service';
import { renderExpensesList } from '../components/ExpenseList';

export class HistoryPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(
    private router: Router,
    private store: BudgetStore,
    private service: BudgetService
  ) {
    super('history-page');
  }

  protected onShow(): void {
    const listElement = document.querySelector('#history-page .list') as HTMLUListElement | null;
    const todayAverageElement = document.getElementById('avarage-expense-history') as HTMLElement;

    const render = () => {
      const state = this.store.getState();
      const expensesReversed = [...state.expenses].reverse();
      renderExpensesList(listElement, expensesReversed, this.service, true);
      todayAverageElement.textContent = `Средние траты в день: ${BudgetSelectors.averageTodayExpense(state)} ₽`;
    };

    render();
    this.unsubscribe = this.store.subscribe(render);

    document.getElementById('back-from-history-btn')?.addEventListener('click', () => {
      this.router.navigate('main');
    });
  }

  protected onHide(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
