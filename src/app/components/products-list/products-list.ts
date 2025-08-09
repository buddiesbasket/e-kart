import { ChangeDetectionStrategy, Component, importProvidersFrom, inject, OnInit, signal } from '@angular/core';
import { ProductCard } from "../product-card/product-card";
import { Product, ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [ProductCard],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsList implements OnInit {
  products = signal<Product[]>([]);
  private productService = inject(ProductService);

  ngOnInit() {
    this.getProducts();
  }

  getProducts(){
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products.set(res);
        // console.log('Products fetched successfully:', this.products());
      }
    })
  }
}
