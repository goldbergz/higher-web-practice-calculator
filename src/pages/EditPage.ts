import { Page } from '../components/Page';
import { budgetState } from '../models/BudgetState';
import { Router } from '../models/Router';
import { Budget } from '../utils/ZodSchema';
import { BudgetSelectors } from '../services/BudgetSelectors';
import { BudgetValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../services/formErrors';

export class EditPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(private router: Router) {
    super('edit-page');
  }

  protected onShow(): void {
    const form = document.getElementById('edit-form') as HTMLFormElement;
    const balanceInput = document.getElementById('deposit-balance-input') as HTMLInputElement;
    const dateInput = document.getElementById('time-limit-edit-input') as HTMLInputElement;

    const totalBalanceEditElement = document.getElementById('edit-balance-info') as HTMLElement;
    const daysInfoEditElement = document.getElementById('edit-days-info') as HTMLElement;
    const dailyAmountEditElement = document.getElementById('daily-amount-edit') as HTMLElement;
    const state = budgetState.getState();

    balanceInput.value = '';
    if (state.endDate) {
      dateInput.value = state.endDate.toLocaleDateString('ru-RU');
    }

    const render = () => {
      const state = budgetState.getState();
      totalBalanceEditElement.textContent = `${state.initialBalance} ₽`;
      daysInfoEditElement.textContent = `на ${BudgetSelectors.daysLeft(state)} дней`;
      dailyAmountEditElement.textContent = `${state.dailyAmount} ₽ в день`;
    };

    render();
    this.unsubscribe = budgetState.subscribe(render);

    document.querySelector('.button-return')?.addEventListener('click', () => {
      this.router.navigate('main');
    });

    form.onsubmit = async e => {
      e.preventDefault();

      const deposit = Number(balanceInput.value);
      const endDate = new Date(dateInput.value.split('.').reverse().join('-'));

      const data: Budget = {
        initialBalance: deposit,
        endDate,
      };

      const result = BudgetValidator.validate(data);

      if (!result.success) {
        showFormErrors(result.error, 'edit');
        return;
      }
      const currentState = budgetState.getState();
      await budgetState.updateBudget(currentState.initialBalance + deposit, endDate);
      this.router.navigate('main');
    };
  }

  protected onHide(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
