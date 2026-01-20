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
    li.className =
      'w-full flex flex-row justify-between items-center border-b border-(--secondarytext-color)';

    const leftSection = document.createElement('div');
    leftSection.className = 'list-item-left';

    const sum = document.createElement('span');
    sum.className = 'list-item-sum';
    sum.textContent = `${exp.amount} ₽`;

    leftSection.appendChild(sum);

    const rightSection = document.createElement('div');
    rightSection.className = 'list-item-right';

    const date = document.createElement('span');
    date.className = 'list-item-date';
    date.textContent = today;

    rightSection.appendChild(date);

    if (withRemove && exp.id !== undefined) {
      const removeBtn = document.createElement('img');
      removeBtn.src = '/assets/cross.svg';
      removeBtn.className = 'list-item-remove';
      removeBtn.alt = 'Удалить';

      removeBtn.addEventListener('click', () => {
        budgetState.deleteExpense(exp.id!);
      });

      rightSection.appendChild(removeBtn);
    }

    li.append(leftSection, rightSection);
    list.appendChild(li);
  });
}
