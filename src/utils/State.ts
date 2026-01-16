type Listener<T> = (state: T) => void;

export class State<T> {
  private state: T;
  private listeners = new Set<Listener<T>>();

  constructor(initialState: T) {
    this.state = initialState;
  }

  getState(): T {
    return this.state;
  }

  setState(partial: Partial<T> | ((state: T) => Partial<T>), replace = false): void {
    const nextPartial = typeof partial === 'function' ? partial(this.state) : partial;

    this.state = replace ? (nextPartial as T) : { ...this.state, ...nextPartial };

    this.listeners.forEach(listener => listener(this.state));
  }

  subscribe(listener: Listener<T>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
