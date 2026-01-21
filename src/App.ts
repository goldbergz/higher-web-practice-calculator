import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Russian } from 'flatpickr/dist/l10n/ru.js';

import { BudgetStore } from './models/budget/budget.store';
import { Router } from './models/Router';
import { EditPage } from './pages/EditPage';
import { HistoryPage } from './pages/HistoryPage';
import { MainPage } from './pages/MainPage';
import { StartPage } from './pages/StartPage';
import { BudgetRepository } from './services/budget.repository';
import { BudgetService } from './services/budget.service';

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
    locale: Russian,
    wrap: false,
    defaultDate: 'today',
    nextArrow: '→',
    prevArrow: '←',
  });

  flatpickr('#time-limit-edit-input', {
    dateFormat: 'd.m.Y',
    allowInput: false,
    clickOpens: true,
    locale: Russian,
    wrap: false,
    defaultDate: 'today',
    nextArrow: '→',
    prevArrow: '←',
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
