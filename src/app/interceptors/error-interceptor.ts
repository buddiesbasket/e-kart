// error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, retry, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { environment } from '../../environments/environment';

interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  const started = Date.now();

  return next(req).pipe(
    tap(() => {
      if (environment.production) return;
      retry(1);
      const elapsed = Date.now() - started;
      console.log(`Request to ${req.url} took ${elapsed}ms`);
    }),
    catchError((error) => {
      let message = 'An error occurred';

      if (typeof error.error?.message === 'string') {
        message = error.error.message;
      } else if (error.statusText) {
        message = error.statusText;
      }

      toastService.show('error', message);

      console.error('HTTP Error:', {
        url: req.url,
        status: error.status,
        message: error.message,
        backendMessage: error.error?.message,
      });

      return throwError(() => error);
    })
  );
};
