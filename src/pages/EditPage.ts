import { Page } from '../components/Page';
import { Router } from '../models/Router';

export class EditPage extends Page {
  constructor(private router: Router) {
    super('edit-page');
  }

  protected onShow(): void {
    const form = document.forms.namedItem('edit-form');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.router.navigate('main');
    });
  }
}