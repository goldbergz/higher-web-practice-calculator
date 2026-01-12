import { Page } from '../components/Page';
import { Router } from '../models/Router';

export class StartPage extends Page {
  constructor(private router: Router) {
    super('start-page');
  }

  protected onShow(): void {
    const form = document.getElementById('start-form') as HTMLFormElement;

    form.onsubmit = (e) => {
      e.preventDefault();
      // Zod + IndexedDB
      this.router.navigate('main');
    };
  }
}