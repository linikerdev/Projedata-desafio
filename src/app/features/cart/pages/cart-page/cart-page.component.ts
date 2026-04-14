import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { CartCounterComponent } from '../../components/cart-counter/cart-counter.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, CartCounterComponent],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartPageComponent {
  readonly cart = viewChild.required(CartCounterComponent);

  readonly lastEmittedTotal = signal<number | null>(null);

  onTotalChanged(value: number): void {
    this.lastEmittedTotal.set(value);
  }
}
