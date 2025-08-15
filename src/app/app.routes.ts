import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home').then((m) => m.Home),
  },
  {
    path: 'products-list',
    loadComponent: () =>
      import('./components/products-list/products-list').then(
        (m) => m.ProductsList
      ),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail').then(
        (m) => m.ProductDetail
      ),
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart').then((m) => m.Cart),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then((m) => m.Register),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/profile/profile').then((m) => m.Profile),
    canActivate: [() => import('./guards/auth-guard').then((m) => m.authGuard)],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/orders/orders').then((m) => m.Orders),
    canActivate: [() => import('./guards/auth-guard').then((m) => m.authGuard)],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./components/no-page-found/no-page-found').then(
        (m) => m.NoPageFound
      ),
  },
];
