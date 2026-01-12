import { Page } from '../components/Page';
import { Router } from '../models/Router';

export class MainPage extends Page {
  constructor(private router: Router) {
    super('main-page');
  }

  protected onShow(): void {
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
  }
}
