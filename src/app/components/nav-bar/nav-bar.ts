import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { Cart } from '../cart/cart';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-nav-bar',
  imports: [Cart, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavBar implements OnInit{
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  protected isLoggedIn = computed(() => this.authService.isLoggedIn());
  protected user = computed(() => this.authService.getUser());

  cartCount = computed(() => this.cartService.getCartCount());

  ngOnInit(): void {

  }

   logout() {
    this.authService.logout().subscribe({
      next: (res: any) => console.log('Logout response: ', res),
      error: err => console.log('Logout error:', err),
    });
  }
}
