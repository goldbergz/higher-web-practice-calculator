import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { budgetState } from '../models/BudgetState';
import { renderExpensesList } from '../services/ExpensesRenderer';
import { BudgetSelectors } from '../services/BudgetSelectors';

export class HistoryPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(private router: Router) {
    super('history-page');
  }

  protected onShow(): void {
    const listElement = document.querySelector('#history-page .list') as HTMLUListElement | null;
    const todayAverageElement = document.getElementById('avarage-expense-history') as HTMLElement;

    if (!listElement) return;

    const render = () => {
      const state = budgetState.getState();
      const expensesReversed = state.expenses.slice().reverse();
      renderExpensesList(listElement, expensesReversed, true);
      todayAverageElement.textContent = `Средние траты в день: ${BudgetSelectors.averageTodayExpense(state)} ₽`;
    };

    render();
    this.unsubscribe = budgetState.subscribe(render);

    document.getElementById('back-from-history-btn')?.addEventListener('click', () => {
      this.router.navigate('main');
    });
  }

  protected onHide(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
