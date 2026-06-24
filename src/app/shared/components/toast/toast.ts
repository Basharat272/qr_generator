import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast" [class.show]="toast.visible()" role="status" aria-live="polite">
      {{ toast.message() }}
    </div>
  `,
  styles: `
    .toast {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: var(--text);
      color: var(--surface);
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.625rem 1.25rem;
      border-radius: var(--radius-full);
      box-shadow: var(--shadow-md);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
      z-index: 100;
      white-space: nowrap;
    }

    .toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `,
})
export class ToastComponent {
  readonly toast = inject(ToastService);
}
