import { Expense } from '../models/ZodSchema';

export function renderExpensesList(list: HTMLUListElement | null, expenses: Expense[]): void {
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

    li.append(sum, date);
    list.appendChild(li);
  });
}
