import { ZodError } from 'zod';

export function showFormErrors(error: ZodError, prefix: string) {
  document
    .querySelectorAll(`#${prefix}-page .form-input-error`)
    .forEach(el => (el.textContent = ''));

  error.issues.forEach(issue => {
    const field = issue.path[0];
    let el: HTMLElement | null = null;

    if (field === 'initialBalance') {
      el = document.getElementById(`${prefix}-balance-error`);
    }

    if (field === 'endDate') {
      el = document.getElementById(`${prefix}-date-error`);
    }

    if (field === 'amount') {
      el = document.getElementById('expense-error');
    }

    if (field === 'deposit') {
      el = document.getElementById(`${prefix}-balance-error`);
    }

    if (el) {
      el.textContent = issue.message;
    }
  });
}
