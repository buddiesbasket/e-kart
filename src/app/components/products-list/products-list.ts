import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import {
  Product,
  ProductService,
} from '../../services/product.service';
import { SearchService } from '../../services/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  Observable,
  of,
  Subject,
  switchMap,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-products-list',
  imports: [ProductCard],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsList {
  private productService = inject(ProductService);
  private searchService = inject(SearchService);
  private destroyRef$ = inject(DestroyRef);
  protected products = signal<Product[]>([]);
  protected initialLoading = signal<boolean>(true);
  protected loadingMore = signal<boolean>(false);
  protected errorMessage = signal<string | null>(null);
  protected limit = 8;
  protected skip = 0;
  protected total = 0;
  protected fetching = false;
  protected searchTrigger$ = new Subject<string>();
  protected lastQuery: string | undefined;

  constructor() {
    effect(() => {
      const query = this.searchService.query()?.trim() ?? '';

      // Skip if query hasn't changed
      if (query === this.lastQuery) return;
      this.lastQuery = query;

      // Reset pagination & products
      this.skip = 0;
      this.products.set([]);

      if (query === '') {
        // Empty search: load immediately (first page)
        this.executeLoad(true, query)
          .pipe(takeUntilDestroyed(this.destroyRef$))
          .subscribe();
      } else {
        // Debounced search trigger
        this.searchTrigger$.next(query);
      }
    });

    // Search pipeline
    this.searchTrigger$
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((query) => this.executeLoad(true, query)),
        takeUntilDestroyed(this.destroyRef$)
      )
      .subscribe();
  }

  protected executeLoad(initial = false, query = ''): Observable<void> {
    if (this.fetching) return of(undefined);
    this.fetching = true;

    if (initial) {
      this.initialLoading.set(true);
    } else {
      this.loadingMore.set(true);
    }

    const request$: Observable<any> =
      query !== ''
        ? this.productService.searchProducts(this.limit, this.skip, query)
        : this.productService.getProducts(this.limit, this.skip);

    return request$.pipe(
      switchMap((res: any) => {
        // Get product list
        const products = res?.product ? res?.product?.products : res;

        if (query !== '') {
          const filteredProducts =
            products?.filter((p: any) => {
              return p?.title
                ?.toLowerCase()
                .includes(query.trim().toLowerCase());
            }) ?? [];
          this.products.set(filteredProducts);
        } else {
          this.products.update((curr) => [...curr, ...products]);
        }

        // Update total
        this.total = res?.total ?? res?.product?.total ?? products.length;

        // Increment skip for pagination
        this.skip += this.limit;

        this.errorMessage.set(null);
        return of(undefined);
      }),
      catchError((err) => {
        console.error('API error:', err);
        this.errorMessage.set(err.message || 'Failed to load products');
        return of(undefined);
      }),
      finalize(() => {
        this.fetching = false;
        this.initialLoading.set(false);
        this.loadingMore.set(false);
      })
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    if (this.shouldLoadMore()) {
      this.executeLoad(false, this.lastQuery)
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe();
    }
  }

  private shouldLoadMore(): boolean {
    if (!this.products().length) return false;
    // Calculate scroll position
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY;

    // Trigger when within 200px of bottom
    return windowHeight + scrollPosition >= documentHeight - 100;
  }
}
