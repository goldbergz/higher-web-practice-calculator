import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import { Router } from './models/Router';
import { StartPage } from './pages/StartPage';
import { MainPage } from './pages/MainPage';
import { HistoryPage } from './pages/HistoryPage';
import { EditPage } from './pages/EditPage';
import { budgetState } from './models/BudgetState';

export async function initApp(): Promise<void> {
  const router = new Router();

  router.register('start', new StartPage(router), '/');
  router.register('main', new MainPage(router), '/main');
  router.register('history', new HistoryPage(router), '/history');
  router.register('edit', new EditPage(router), '/edit');

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

  await budgetState.init();
  const state = budgetState.getState();
  const hasBudget = state.initialBalance > 0 && state.endDate !== null;

  if (hasBudget) {
    router.navigate('main');
  } else {
    router.navigate('start');
  }
  router.init();
}
