import { Page } from '../components/Page';
import { Router } from '../models/Router';

export class HistoryPage extends Page {
  constructor(private router: Router) {
    super('history-page');
  }

  protected onShow(): void {
    document
      .getElementById('back-from-history-btn')
      ?.addEventListener('click', () => {
        this.router.navigate('main');
      });
  }
}
