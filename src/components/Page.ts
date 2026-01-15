export abstract class Page {
  protected root: HTMLElement;

  constructor(protected id: string) {
    const el = document.getElementById(id);
    if (!el) {
      throw new Error(`Page with id "${id}" not found`);
    }
    this.root = el;
  }

  show(): void {
    this.root.classList.remove('hidden');
    this.onShow();
  }

  hide(): void {
    this.root.classList.add('hidden');
    this.onHide();
  }

  protected onShow(): void {}
  protected onHide(): void {}
}
