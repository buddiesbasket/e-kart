import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { Product } from '../../services/product.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Cart {
  private cartService = inject(CartService);

  get cartItems() {
    return this.cartService.getCartItems();
  }
  get totalCount() {
    return this.cartService.getCartCount();
  }

  get cartSubtotal() {
    return this.cartService.getCartSubtotal();
  }

  proceedToCheckout() {
    // Implement checkout logic here
  }

  removeFromCart(item: Product){
    this.cartService.removeFromCart(item);
  }
}