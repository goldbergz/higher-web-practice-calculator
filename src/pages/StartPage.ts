import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { Budget } from '../utils/ZodSchema';
import { BudgetValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../services/formErrors';
import { budgetState } from '../models/BudgetState';

export class StartPage extends Page {
  constructor(private router: Router) {
    super('start-page');
  }
  protected onShow(): void {
    const form = document.getElementById('start-form') as HTMLFormElement;
    const balanceInput = document.getElementById('start-balance-input') as HTMLInputElement;
    const dateInput = document.getElementById('time-limit-input') as HTMLInputElement;

    balanceInput.addEventListener('input', () => {
      document.getElementById('start-balance-input')!.textContent = '';
    });

    dateInput.addEventListener('input', () => {
      document.getElementById('time-limit-input')!.textContent = '';
    });

    form.onsubmit = async e => {
      e.preventDefault();

      const data: Budget = {
        initialBalance: Number(balanceInput.value),
        endDate: new Date(dateInput.value.split('.').reverse().join('-')),
      };

      const result = BudgetValidator.validate(data);

      if (!result.success) {
        showFormErrors(result.error, 'start');
        return;
      }

      await budgetState.setBudget(
        Number(balanceInput.value),
        new Date(dateInput.value.split('.').reverse().join('-'))
      );
      this.router.navigate('main');
    };
  }
}
