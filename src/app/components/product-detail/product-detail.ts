import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCard } from '../product-card/product-card';
import { UtilService } from '../../services/util.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, ProductCard, FormsModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetail implements OnInit {
  @ViewChild('mainImage') mainImageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('imageModel') imageModel: any;
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  protected utilService = inject(UtilService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private modalService = inject(NgbModal);

  protected product!: Product;
  protected id = Number(this.route.snapshot.paramMap.get('id'));
  protected loading = signal(true);
  protected relatedProducts$ = this.productService.getProducts(4, 3);
  protected currentImageIndex = 0;
  protected isZoomVisible = false;
  protected lensStyle: any = {};
  protected zoomImageStyle: any = {};
  protected lensSize = 180; // size of lens in px
  protected zoomLevel = 2.5; // zoom multiplier
  protected quantity = 1;

  ngOnInit(): void {
    this.getProductDetails();
  }

  protected getProductDetails() {
    this.loading.set(true);
    this.productService.getProductById(this.id).subscribe({
      next: (res) => {
        this.product = res;
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected addToCart(product: Product) {
    this.cartService.addToCart(product, this.quantity);
    this.toastService.show('success', `${product.title} added to cart`);
  }

  protected buyNow(product: Product) {
    this.cartService.addToCart(product, this.quantity);
    this.router.navigate(['/checkout']);
  }

  protected showZoom() {
    this.isZoomVisible = true;
  }

  protected hideZoom() {
    this.isZoomVisible = false;
  }

  protected moveLens(event: MouseEvent) {
    const img = this.mainImageRef.nativeElement;
    const rect = img.getBoundingClientRect();

    let x = event.clientX - rect.left - this.lensSize / 2;
    let y = event.clientY - rect.top - this.lensSize / 2;

    // Bound lens inside image
    x = Math.max(0, Math.min(x, rect.width - this.lensSize));
    y = Math.max(0, Math.min(y, rect.height - this.lensSize));

    this.lensStyle = {
      left: `${x}px`,
      top: `${y}px`,
      width: `${this.lensSize}px`,
      height: `${this.lensSize}px`,
    };

    this.zoomImageStyle = {
      transform: `translate(${-x * this.zoomLevel}px, ${
        -y * this.zoomLevel
      }px)`,
      width: `${rect.width * this.zoomLevel}px`,
      height: `${rect.height * this.zoomLevel}px`,
    };
  }

  // Open Image Modal
  protected openImageModal(index: number) {
    this.currentImageIndex = index;
    this.modalService.open(this.imageModel, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
    });
  }

  // Image navigation
  protected navigateImage(direction: 'prev' | 'next', images: string[]) {
    if (direction === 'prev' && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
    if (direction === 'next' && this.currentImageIndex < images.length - 1) {
      this.currentImageIndex++;
    }
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
