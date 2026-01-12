import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { Budget } from '../models/ZodSchema';
import { BudgetValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../utils/formErrors';

export class EditPage extends Page {
  constructor(private router: Router) {
    super('edit-page');
  }

  protected onShow(): void {
    const form = document.getElementById('edit-form') as HTMLFormElement;
    const balanceInput = document.getElementById(
      'deposit-balance-input'
    ) as HTMLInputElement;
    const dateInput = document.getElementById(
      'time-limit-edit-input'
    ) as HTMLInputElement;

    form.onsubmit = (e) => {
      e.preventDefault();

      const data: Budget = {
        initialBalance: Number(balanceInput.value),
        endDate: new Date(dateInput.value.split('.').reverse().join('-')),
      };

      const result = BudgetValidator.validate(data);

      if (!result.success) {
        showFormErrors(result.error, 'edit');
        return;
      }
            // IndexedDB

      this.router.navigate('main');
    };
  }
}