import { budgetState } from '../models/BudgetState';
import { Expense } from '../utils/ZodSchema';

export function renderExpensesList(
  list: HTMLUListElement | null,
  expenses: Expense[],
  withRemove = false
): void {
  if (!list) return;

  list.innerHTML = '';

  const today = new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });

  expenses.forEach(exp => {
    const li = document.createElement('li');
    li.className = 'list-item';

    const sum = document.createElement('span');
    sum.className = 'list-item-sum';
    sum.textContent = `${exp.amount} ₽`;

    const date = document.createElement('span');
    date.className = 'list-item-date';
    date.textContent = today;

    const removeBtn = document.createElement('img');
    removeBtn.src = '/assets/cross.svg';
    removeBtn.className = 'list-item-remove';
    removeBtn.alt = 'Удалить';

    removeBtn.addEventListener('click', () => {
      if (exp.id !== undefined) {
        budgetState.deleteExpense(exp.id);
      }
    });

    li.append(sum, date);

    if (withRemove && exp.id !== undefined) {
      const removeBtn = document.createElement('img');
      removeBtn.src = '/assets/cross.svg';
      removeBtn.className = 'list-item-remove';
      removeBtn.alt = 'Удалить';

      removeBtn.addEventListener('click', () => {
        budgetState.deleteExpense(exp.id!);
      });

      li.appendChild(removeBtn);
    }
    list.appendChild(li);
  });
}
