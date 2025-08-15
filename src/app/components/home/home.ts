import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilService } from '../../services/util.service';
import { Product, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [DecimalPipe, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private modalService = inject(NgbModal);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  protected utilService = inject(UtilService);
  private productService = inject(ProductService);

  protected featuredProducts = signal<Product[]>([]);
  protected selectedProduct: Product | null = null;
  protected quantity = 1;

  ngOnInit(): void {
    this.fetchFeaturedProducts();
  }

  protected fetchFeaturedProducts(): void {
    this.productService.getProducts(4, 10).subscribe((response) => {
      this.featuredProducts.set(response);
    });
  }

  protected navigateToCategory(categoryId: string): void {
    this.router.navigate(['/products-list'], {
      queryParams: { category: categoryId },
    });
  }

  protected quickView(product: any, content: any): void {
    this.selectedProduct = product;
    this.quantity = 1;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  protected addToCart(product: any): void {
    this.cartService.addToCart(product, this.quantity);
    this.toastService.show('success', `${product.title} added to cart`);
  }

  protected addToWishlist(product: any): void {
    console.log('Added to wishlist:', product);
  }

  protected incrementQuantity(): void {
    this.quantity++;
  }

  protected decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
