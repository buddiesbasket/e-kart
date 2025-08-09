import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  @Input() product!: Product;

  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  addToCart(product: Product){
    this.toastService.show('success', `${product.title} added to cart`);
    this.cartService.addToCart(product);
  }
}
