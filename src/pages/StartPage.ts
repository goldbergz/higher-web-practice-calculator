import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { Budget } from '../models/ZodSchema';
import { BudgetValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../utils/formErrors';

export class StartPage extends Page {
  constructor(private router: Router) {
    super('start-page');
  }
  protected onShow(): void {
    const form = document.getElementById('start-form') as HTMLFormElement;
    const balanceInput = document.getElementById(
      'start-balance-input'
    ) as HTMLInputElement;
    const dateInput = document.getElementById(
      'time-limit-input'
    ) as HTMLInputElement;

    form.onsubmit = (e) => {
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

      // IndexedDB
      this.router.navigate('main');
    };
  }

}