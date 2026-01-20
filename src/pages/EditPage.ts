import { Page } from '../components/Page';
import { budgetState } from '../models/BudgetState';
import { Router } from '../models/Router';
import { BudgetSelectors } from '../services/BudgetSelectors';
import { BudgetValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../services/formErrors';
import { Budget, DepositSchema } from '../utils/ZodSchema';

export class EditPage extends Page {
  private unsubscribe: (() => void) | null = null;

  constructor(private router: Router) {
    super('edit-page');
  }

  protected onShow(): void {
    const form = document.getElementById('edit-form') as HTMLFormElement;
    const balanceInput = document.getElementById('edit-balance-input') as HTMLInputElement;

    const state = budgetState.getState();

    if (window.innerWidth < 768) {
      balanceInput.value = state.initialBalance.toString();
    }

    const depositInput = document.getElementById('deposit-balance-input') as HTMLInputElement;
    const dateInput = document.getElementById('time-limit-edit-input') as HTMLInputElement;

    const totalBalanceEditElement = document.getElementById('edit-balance-info') as HTMLElement;
    const daysInfoEditElement = document.getElementById('edit-days-info') as HTMLElement;
    const dailyAmountEditElement = document.getElementById('daily-amount-edit') as HTMLElement;

    depositInput.value = '';
    if (state.endDate) {
      dateInput.value = state.endDate.toLocaleDateString('ru-RU');
    }

    const render = () => {
      const state = budgetState.getState();
      totalBalanceEditElement.textContent = `${state.initialBalance} ₽`;
      daysInfoEditElement.textContent = `на ${BudgetSelectors.daysLeft(state)} дней`;
      dailyAmountEditElement.textContent = `${state.dailyAmount} ₽ в день`;
      if (window.innerWidth < 768) {
        balanceInput.value = state.initialBalance.toString();
      }
    };

    render();
    this.unsubscribe = budgetState.subscribe(render);

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
      const result = DepositSchema.safeParse({ deposit });
      if (!result.success) {
        document.getElementById('edit-balance-error')!.textContent = result.error.issues[0].message;
        return;
      }
      let endDate: Date | undefined;
      if (dateInput.value) {
        const [day, month, year] = dateInput.value.split('.');
        endDate = new Date(+year, +month - 1, +day);
      }
      const currentState = budgetState.getState();

      const data: Budget = {
        initialBalance: currentState.initialBalance + deposit,
        endDate: endDate!,
      };
      const budgetResult = BudgetValidator.validate(data);

      if (!budgetResult.success) {
        showFormErrors(budgetResult.error, 'edit');
        return;
      }
      await budgetState.updateBudget(data.initialBalance, data.endDate);
      this.router.navigate('main');
    };
  }

  protected onHide(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}
