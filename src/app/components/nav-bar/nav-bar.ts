import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Cart } from '../cart/cart';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-nav-bar',
  imports: [Cart, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavBar {
  private cartService = inject(CartService);
  protected authService = inject(AuthService);
  protected toastService = inject(ToastService);
  private searchService = inject(SearchService);

  protected cartCount = computed(() => this.cartService.getCartCount());
  protected currentUser = computed(() => {
    const user = this.authService.user();
    return user
      ? {
          ...user,
          username: user.name || 'User', // Fallback for username
        }
      : null;
  });

  protected onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchService.setQuery(value);
  }

  protected logout() {
    this.authService.logout().subscribe({
      next: (res: { message: string }) => {
        this.toastService.show(
          'success',
          res.message || 'You have been logged out successfully'
        );
      },
      error: () => this.toastService.show('success', 'Logged out successfully'),
    });
  }
}
