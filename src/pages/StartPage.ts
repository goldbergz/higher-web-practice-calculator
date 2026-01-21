import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { BudgetService } from '../services/budget.service';
import { BudgetStore } from '../models/budget/budget.store';
import { showFormErrors } from '../services/errors.service';
import { BudgetValidator } from '../services/validation.service';

export class StartPage extends Page {
  constructor(
    private router: Router,
    private store: BudgetStore,
    private service: BudgetService
  ) {
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

      const data = {
        initialBalance: Number(balanceInput.value),
        endDate: new Date(dateInput.value.split('.').reverse().join('-')),
        dailyLimit: 0,
      };

      const result = BudgetValidator.validate(data);

      if (!result.success) {
        showFormErrors(result.error, 'start');
        return;
      }

      data.dailyLimit = this.service.calculateDailyLimit(data.initialBalance, data.endDate);

      await this.service.setBudget(data);
      this.router.navigate('main');
    };
  }
}
