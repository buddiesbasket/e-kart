import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, shareReplay, debounceTime, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: Meta;
  images: string[];
  thumbnail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface SearchResponse {
  products: Product[];
  total: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private searchResultsCache = new Map<string, Observable<SearchResponse>>();

  /** Fetch products with pagination and optional filters */
  getProducts(
    limit: number = 10,
    skip: number = 0,
    search?: string,
    extraParams?: Record<string, string | number>
  ): Observable<Product[]> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);

    if (search) {
      params = params.set('search', search);
    }

    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        params = params.set(key, String(value));
      });
    }

    return this.http
      .get<{ products: any[] }>(`${environment.apiUrl}/products`, { params })
      .pipe(
        map(res => this.productsMapper(res.products)),
        shareReplay({ bufferSize: 1, refCount: true }) // ✅ Caches the latest value
      );
  }

  /** Search products with caching + debounce */
  searchProducts(limit: number = 8, skip: number = 0, query: string): Observable<SearchResponse> {
    const cacheKey = `${query}-${limit}-${skip}`;
    const cached = this.searchResultsCache.get(cacheKey);
    if (cached) return cached;

    const search$ = of(query).pipe(
      debounceTime(300), // ✅ Prevents firing requests for every keystroke
      switchMap(q => {
        if (!q.trim().toLowerCase()) return of({ products: [], total: 0 });
        const params = new HttpParams()
        .set('q', query.trim().toLowerCase())
        .set('limit', limit.toString())
        .set('skip', skip.toString())

        return this.http
          .get<SearchResponse>(`${environment.apiUrl}/products/search`, { params })
          .pipe(
            catchError(err => {
              console.error('Search error:', err);
              return of({ products: [], total: 0 });
            })
          );
      }),
      shareReplay({ bufferSize: 1, refCount: true }) // ✅ Cache per query params
    );

    this.searchResultsCache.set(cacheKey, search$);
    return search$;
  }

  clearSearchCache() {
    this.searchResultsCache.clear();
  }

  /** Fetch product by ID */
  getProductById(id: number): Observable<Product> {
    return this.http
      .get<{ product: any }>(`${environment.apiUrl}/products/${id}`)
      .pipe(
        map(res => this.productMapper(res.product)),
        shareReplay({ bufferSize: 1, refCount: true }) // ✅ Caches single product
      );
  }

  /** Map multiple products */
  private productsMapper(data: any[]): Product[] {
    return data.map(item => this.productMapper(item));
  }

  /** Map single product */
  private productMapper(item: any): Product {
    return {
      id: item.id,
      title: item.title,
      price: item.price,
      discount: item.discountPercentage,
      description: item.description,
      images: item.images ?? [],
      category: item.category ?? 'Uncategorized',
      stock: item.stock ?? 0,
      rating: item.rating,
      reviews: item.reviews ?? [],
      brand: item.brand ?? '',
      tags: item.tags ?? [],
      thumbnail: item.thumbnail ?? '',
    };
  }
}
