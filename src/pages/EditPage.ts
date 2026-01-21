import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { BudgetStore } from '../models/budget/budget.store';
import { BudgetService } from '../services/budget.service';
import { BudgetSelectors } from '../services/budget.selectors';
import { showFormErrors } from '../services/errors.service';
import { BudgetValidator, DepositValidator } from '../services/validation.service';

export class EditPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(
    private router: Router,
    private store: BudgetStore,
    private service: BudgetService
  ) {
    super('edit-page');
  }

  protected onShow(): void {
    const form = document.getElementById('edit-form') as HTMLFormElement;
    const balanceInput = document.getElementById('edit-balance-input') as HTMLInputElement;

    const depositInput = document.getElementById('deposit-balance-input') as HTMLInputElement;
    const dateInput = document.getElementById('time-limit-edit-input') as HTMLInputElement;

    const totalBalanceEditElement = document.getElementById('edit-balance-info') as HTMLElement;
    const daysInfoEditElement = document.getElementById('edit-days-info') as HTMLElement;
    const dailyAmountEditElement = document.getElementById('daily-amount-edit') as HTMLElement;

    const render = () => {
      const state = this.store.getState();
      if (!state.budget) return;

      totalBalanceEditElement.textContent = `${state.budget.initialBalance} ₽`;
      daysInfoEditElement.textContent = `на ${BudgetSelectors.daysLeft(state)} дней`;
      dailyAmountEditElement.textContent = `${state.budget.dailyLimit} ₽ в день`;

      if (window.innerWidth < 768) {
        balanceInput.value = state.budget.initialBalance.toString();
      }

      if (state.budget.endDate) {
        const day = state.budget.endDate.getDate().toString().padStart(2, '0');
        const month = (state.budget.endDate.getMonth() + 1).toString().padStart(2, '0');
        const year = state.budget.endDate.getFullYear();
        dateInput.value = `${day}.${month}.${year}`;
      }
    };

    render();
    this.unsubscribe = this.store.subscribe(render);

    depositInput.addEventListener('input', () => {
      document.getElementById('edit-balance-error')!.textContent = '';
    });

    dateInput.addEventListener('input', () => {
      document.getElementById('edit-date-error')!.textContent = '';
    });

    document.querySelector('.button-return')?.addEventListener('click', () => {
      this.router.navigate('main');
    });

    form.onsubmit = async e => {
      e.preventDefault();

      const deposit = Number(depositInput.value);
      const depositResult = DepositValidator.validate({ deposit });

      if (!depositResult.success) {
        showFormErrors(depositResult.error, 'edit');
        return;
      }

      let endDate: string | undefined;
      if (dateInput.value) {
        endDate = dateInput.value;
      }

      const currentState = this.store.getState();
      if (!currentState.budget) return;

      const newBudgetData = {
        initialBalance: currentState.budget.initialBalance + deposit,
        endDate: endDate || currentState.budget.endDate.toISOString().split('T')[0],
        dailyLimit: 0,
      };

      const budgetResult = BudgetValidator.validate(newBudgetData);

      if (!budgetResult.success) {
        showFormErrors(budgetResult.error, 'edit');
        return;
      }

      const newBudget = {
        ...budgetResult.data,
        dailyLimit: this.service.calculateDailyLimit(
          budgetResult.data.initialBalance,
          budgetResult.data.endDate
        ),
      };

      await this.service.updateBudget(newBudget);
      this.router.navigate('main');
    };
  }

  protected onHide(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
