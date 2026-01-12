import { Page } from '../components/Page';
import { Router } from '../models/Router';
import { Expense } from '../models/ZodSchema';
import { BudgetValidator } from '../services/BudgetValidator';
import { showFormErrors } from '../utils/formErrors';

export class MainPage extends Page {
  constructor(private router: Router) {
    super('main-page');
  }

  protected onShow(): void {
    const form = document.getElementById('add-expense') as HTMLFormElement;
    const expenseInput = document.getElementById(
      'expense-input'
    ) as HTMLInputElement;

    document
      .querySelector('.button-history')
      ?.addEventListener('click', () => {
        this.router.navigate('history');
      });

    document
      .querySelector('.balance__buttons .button')
      ?.addEventListener('click', () => {
        this.router.navigate('edit');
      });

    form.onsubmit = (e) => {
          e.preventDefault();
    
          const data: Expense = {
            amount: Number(expenseInput.value),
          };
    
          const result = BudgetValidator.validate(data);
    
          if (!result.success) {
            showFormErrors(result.error, 'main');
            return;
          }
          // IndexedDB
          expenseInput.value = '';
    };
  }
}
