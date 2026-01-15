import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { budgetState } from '../models/BudgetState';
import { renderExpensesList } from '../services/ExpensesRenderer';

export class HistoryPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(private router: Router) {
    super('history-page');
  }

  protected onShow(): void {
    const listElement = document.querySelector('#history-page .list') as HTMLUListElement | null;
    if (!listElement) return;

    const render = () => {
      const { expenses } = budgetState.getState();
      renderExpensesList(listElement, expenses);
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
