import { Injectable, signal } from '@angular/core';
import { Product } from './product.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  cartItems = signal<{ product: Product; quantity: number }[]>([]);

  addToCart(product: Product, quantity: number = 1) {
    const items = this.cartItems();
    const index = items.findIndex((item) => item.product.id === product.id);
    if (index > -1) {
      items[index].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.cartItems.set([...items]);
  }

  getCartItems() {
    return this.cartItems.asReadonly();
  }

  getCartCount() {
    return this.cartItems().reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartSubtotal() {
    return this.cartItems().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  removeFromCart(product: Product) {
    const items = this.cartItems();
    const index = items.findIndex((item) => item.product.id === product.id);
    if (index > -1) {
      items[index].quantity -= 1;
      if (items[index].quantity === 0) {
        items.splice(index, 1);
      }
    }
    this.cartItems.set([...items]);
  }
}
