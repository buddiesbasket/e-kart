import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, tap } from 'rxjs/operators';
import { throwError, timer } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  path?: string;
  timestamp?: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const router = inject(Router);
  const authService = inject(AuthService);
  const started = Date.now();
  const isApiRequest = req.url.startsWith(`${environment.apiUrl}/auth`);

  return next(req).pipe(
    tap(() => {
      if (!environment.production) {
        const elapsed = Date.now() - started;
        console.log(`Request to ${req.url} took ${elapsed}ms`);
      }
    }),
    // Retry failed requests (excluding POST/PUT/PATCH/DELETE)
    retry({
      count: 1,
      delay: (error, retryCount) => {
        if (
          retryCount === 0 &&
          ['GET', 'HEAD', 'OPTIONS'].includes(req.method.toUpperCase()) &&
          !req.url.includes('auth')
        ) {
          return timer(1000); // Retry after 1 second
        }
        return throwError(() => error);
      },
    }),
    catchError((error: HttpErrorResponse) => {
       // Skip handling for logout endpoint
      if (req.url.includes('logout')) {
        return throwError(() => error);
      }

      let message = 'An unexpected error occurred';
      let showToast = true;
      let redirectToLogin = false;

      // Handle structured API errors
      if (error.error?.message) {
        message = error.error.message;
      }
      // Handle HTTP status codes
      else {
        switch (error.status) {
          case 0:
            message = 'Network error - please check your connection';
            break;
          case 400:
            message = 'Invalid request data';
            break;
          case 401:
            message = 'Session expired - please login again';
            showToast = !req.url.includes('logout');
            redirectToLogin = true;
            break;
          case 403:
            message = "You don't have permission for this action";
            break;
          case 404:
            message = 'Requested resource not found';
            showToast = isApiRequest;
            break;
          case 429:
            message = 'Too many requests - please wait';
            break;
          case 500:
            message = 'Server error - please try again later';
            break;
          default:
            message = error.message || 'An unexpected error occurred';
        }
      }

      // Log detailed error in development
      if (!environment.production) {
        console.error('HTTP Error:', {
          url: req.url,
          method: req.method,
          status: error.status,
          message: error.message,
          error: error.error,
          headers: req.headers,
          timestamp: new Date().toISOString(),
        });
      }

      // Show toast notification
      if (showToast) {
        const duration = error.status === 401 ? 5000 : 3000;
        toastService.show('error', message, duration);
      }

      // Handle unauthorized requests
      if (redirectToLogin && !req.url.includes('auth')) {
        authService.clearAuthData();
        router.navigate(['/login'], {
          queryParams: { returnUrl: router.url },
          replaceUrl: true,
        });
      }

      return throwError(() => ({
        ...error,
        userMessage: message,
        timestamp: new Date().toISOString(),
      }));
    })
  );
};
