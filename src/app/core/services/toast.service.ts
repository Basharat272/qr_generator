import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal('');
  readonly visible = signal(false);

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(text: string, durationMs = 2200): void {
    this.message.set(text);
    this.visible.set(true);
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => this.visible.set(false), durationMs);
  }
}
