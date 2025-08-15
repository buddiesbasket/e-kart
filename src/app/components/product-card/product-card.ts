import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CurrencyPipe, NgClass } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { UtilService } from '../../services/util.service';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [CurrencyPipe, NgClass],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  @Input() product: Product | null = null;
  @Input() isSkeleton = false;

  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  protected utilService = inject(UtilService);
  private router = inject(Router);

  protected addToCart(product: Product) {
    this.toastService.show('success', `${product.title} added to cart`);
    this.cartService.addToCart(product, 1);
  }

  protected goToDetail(product: Product) {
    if (product.stock > 0) {
      this.router.navigate(['/product', product.id]);
    }
  }
}
