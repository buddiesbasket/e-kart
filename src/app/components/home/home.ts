import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  private http = inject(HttpClient);
  private router = inject(Router);

  // Using high-quality free images from Pexels/Unsplash
  featuredCategories = [
    {
      id: 'smartphones',
      name: 'Smartphones',
      image:
        'https://images.unsplash.com/photo-1609692814858-f7cd2f0afa4f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      count: 20,
    },
    {
      id: 'laptops',
      name: 'Laptops',
      image:
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop',
      count: 15,
    },
    {
      id: 'fragrances',
      name: 'Fragrances',
      image:
        'https://images.pexels.com/photos/3989821/pexels-photo-3989821.jpeg?auto=compress&cs=tinysrgb&w=800',
      count: 12,
    },
  ];

  featuredProducts: any[] = [];
  selectedProduct: any = null;
  quantity = 1;

  customerReviews = [
    {
      name: 'Alex Johnson',
      avatar:
        'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 5,
      comment:
        'Amazing products and fast delivery! Will definitely shop here again.',
      date: '2023-05-15',
    },
    {
      name: 'Sarah Miller',
      avatar:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4,
      comment:
        'Great customer service. The product quality exceeded my expectations.',
      date: '2023-06-02',
    },
    {
      name: 'Michael Chen',
      avatar:
        'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 5,
      comment: 'Best prices I found online. Packaging was eco-friendly too!',
      date: '2023-06-18',
    },
  ];

  brands = [
    {
      name: 'Apple',
      logo: 'https://1000logos.net/wp-content/uploads/2016/10/Apple-Logo.png',
    },
    {
      name: 'Samsung',
      logo: 'https://1000logos.net/wp-content/uploads/2017/06/Samsung-Logo.png',
    },
    {
      name: 'Sony',
      logo: 'https://1000logos.net/wp-content/uploads/2017/06/Sony-Logo.png',
    },
    {
      name: 'Nike',
      logo: 'https://1000logos.net/wp-content/uploads/2014/03/Nike-Logo.png',
    },
    {
      name: 'Adidas',
      logo: 'https://1000logos.net/wp-content/uploads/2019/06/Adidas-Logo.png',
    },
    {
      name: 'Dior',
      logo: 'https://1000logos.net/wp-content/uploads/2020/04/Dior-Logo.png',
    },
  ];

  heroImage =
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1600&auto=format&fit=crop';

  ngOnInit(): void {
    this.fetchFeaturedProducts();
  }

  fetchFeaturedProducts(): void {
    this.http
      .get('https://dummyjson.com/products?limit=4')
      .subscribe((response: any) => {
        // Replace dummy product images with better quality ones
        this.featuredProducts = response.products.map((product: any) => ({
          ...product,
          thumbnail: this.getHighQualityProductImage(product.category),
        }));
      });
  }

  private getHighQualityProductImage(category: string): string {
    const images: Record<string, string> = {
      smartphones:
        'https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aXBob25lfGVufDB8fDB8fHww',
      laptops:
        'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop',
      fragrances:
        'https://images.pexels.com/photos/3989821/pexels-photo-3989821.jpeg?auto=compress&cs=tinysrgb&w=800',
      skincare:
        'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
      groceries:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
      default:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop',
    };

    return images[category.toLowerCase()] || images['default'];
  }

  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/products'], {
      queryParams: { category: categoryId },
    });
  }

  quickView(product: any, content: any): void {
    this.selectedProduct = product;
    this.quantity = 1;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

  addToCart(product: any): void {
    console.log('Added to cart:', product, 'Quantity:', this.quantity);
    this.modalService.dismissAll();
  }

  addToWishlist(product: any): void {
    console.log('Added to wishlist:', product);
  }

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
