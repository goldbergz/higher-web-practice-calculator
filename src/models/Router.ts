import { Page } from '../components/Page';

export type RouteName = 'start' | 'main' | 'history' | 'edit';

interface RouteConfig {
  page: Page;
  path: string;
}

export class Router {
  private routes = new Map<RouteName, RouteConfig>();
  private currentPage: Page | null = null;

  constructor() {
    window.addEventListener('popstate', event => {
      const route = event.state?.route as RouteName | undefined;
      if (route) {
        this.open(route, false);
      }
    });
  }

  register(route: RouteName, page: Page, path: string): void {
    this.routes.set(route, { page, path });
  }

  navigate(route: RouteName): void {
    this.open(route, true);
  }

  private open(route: RouteName, pushToHistory: boolean): void {
    const config = this.routes.get(route);
    if (!config) {
      throw new Error(`Route "${route}" not registered`);
    }

    this.currentPage?.hide();
    this.currentPage = config.page;
    this.currentPage.show();

    if (pushToHistory) {
      history.pushState({ route }, '', config.path);
    }
  }

  init(): void {
    const currentPath = window.location.pathname;

    const matched = [...this.routes.entries()].find(([, config]) => config.path === currentPath);

    if (matched) {
      this.open(matched[0], false);
    } else {
      this.navigate('start');
    }
  }
}
