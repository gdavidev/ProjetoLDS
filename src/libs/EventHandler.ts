export default class EventHandler<T> {
  private subscribers: ((value: T) => void)[];

  constructor() {
    this.subscribers = []
  }

  subscribe(callback: (value?: T) => void) {
    if (!this.subscribers.includes(callback))
      this.subscribers.push(callback)
  }

  trigger(newValue: T) {
    this.subscribers.forEach(func => {
      func(newValue)
    })
  }

  remove(callback: (value?: T) => void) {
    const index: number = this.subscribers.indexOf(callback);
    if (index > -1)
      this.subscribers.splice(index, 1);
  }
}