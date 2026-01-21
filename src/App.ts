import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { Router } from './models/Router';
import { StartPage } from './pages/StartPage';
import { MainPage } from './pages/MainPage';
import { HistoryPage } from './pages/HistoryPage';
import { EditPage } from './pages/EditPage';
import { BudgetService } from './services/budget.service';
import { BudgetStore } from './models/budget/budget.store';
import { BudgetRepository } from './services/budget.repository';

export async function initApp(): Promise<void> {
  const router = new Router();

  const budgetStore = new BudgetStore();
  const budgetRepo = new BudgetRepository();
  const budgetService = new BudgetService(budgetStore, budgetRepo);

  await budgetService.init();

  router.register('start', new StartPage(router, budgetStore, budgetService), '/');
  router.register('main', new MainPage(router, budgetStore, budgetService), '/main');
  router.register('history', new HistoryPage(router, budgetStore, budgetService), '/history');
  router.register('edit', new EditPage(router, budgetStore, budgetService), '/edit');

  flatpickr('#time-limit-input', {
    dateFormat: 'd.m.Y',
    allowInput: false,
    clickOpens: true,
  });

  flatpickr('#time-limit-edit-input', {
    dateFormat: 'd.m.Y',
    allowInput: false,
    clickOpens: true,
  });

  const state = budgetStore.getState();
  const hasBudget = state.budget !== null && state.budget.initialBalance > 0;

  if (hasBudget) {
    router.navigate('main');
  } else {
    router.navigate('start');
  }
  router.init();
}
