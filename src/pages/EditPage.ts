import { Page } from '../components/Page';
import { budgetState } from '../models/BudgetState';
import { Router } from '../models/Router';
import { Budget } from '../models/ZodSchema';
import { BudgetSelectors } from '../services/BudgetSelectors';
import { BudgetValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../utils/formErrors';

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

    const render = () => {
      const state = budgetState.getState();
      totalBalanceEditElement.textContent = `${state.initialBalance} ₽`;
      daysInfoEditElement.textContent = `на ${BudgetSelectors.daysLeft(state)} дней`;
      dailyAmountEditElement.textContent = `${state.dailyAmount} ₽ в день`;

      totalBalanceEditElement.textContent = `${BudgetSelectors.remainingBalance(state)} ₽`;
      daysInfoEditElement.textContent = `на ${BudgetSelectors.daysLeft(state)} дней`;
    };

    render();
    this.unsubscribe = budgetState.subscribe(render);

    document.querySelector('.button-return')?.addEventListener('click', () => {
      this.router.navigate('main');
    });

    form.onsubmit = e => {
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
      budgetState.setBudget(currentState.initialBalance + deposit, endDate);

      // IndexedDB

      this.router.navigate('main');
    };
  }
}
