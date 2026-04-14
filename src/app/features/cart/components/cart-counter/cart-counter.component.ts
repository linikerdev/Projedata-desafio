import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  output,
  signal,
  untracked,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CartLine } from '../../models/cart-line.model';

@Component({
  selector: 'app-cart-counter',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './cart-counter.component.html',
  styleUrl: './cart-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartCounterComponent {
  private static nextId = 0;

  /** Cart lines; exposed as a signal per requirements. */
  readonly items = signal<CartLine[]>([]);

  /** Sum of quantity × unit price for all lines. */
  readonly total = computed(() =>
    this.items().reduce((sum, line) => sum + line.quantity * line.unitPrice, 0),
  );

  /** Emits whenever `total` changes (including the initial 0). */
  readonly totalChanged = output<number>();

  constructor() {
    effect(() => {
      const value = this.total();
      untracked(() => this.totalChanged.emit(value));
    });
  }

  addItem(name: string, unitPrice: number, quantity = 1): void {
    const q = Math.max(1, Math.floor(quantity));
    this.items.update((lines) => {
      const idx = lines.findIndex((l) => l.name === name && l.unitPrice === unitPrice);
      if (idx >= 0) {
        const next = [...lines];
        const line = next[idx];
        next[idx] = { ...line, quantity: line.quantity + q };
        return next;
      }
      const id = `line-${++CartCounterComponent.nextId}`;
      return [...lines, { id, name, unitPrice, quantity: q }];
    });
  }

  removeItem(id: string): void {
    this.items.update((lines) => lines.filter((l) => l.id !== id));
  }
}
