import { inject, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  token: string;
  user?: {
    id: string;
    username: string;
    email: string;
    phone?: string;
  };
}

interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    phone?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  register(fullName: string, email: string, phone: string, password: string): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${environment.apiUrl}/register`,
      { fullName, email, phone, password }
    ).pipe(
      tap(response => {
        if (response.token) {
          this.storeAuthData(response.token, response.user);
        }
      })
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${environment.apiUrl}/login`,
      { email, password }
    ).pipe(
      tap(response => {
        console.log('Login response: ',response)
        this.storeAuthData(response.token, response.user);
      })
    );
  }

  logout(): Observable<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    this.clearAuthData();
    
    return this.http.post<void>(
      `${environment.apiUrl}/logout`,
      refreshToken ? { refreshToken } : {}
    );
  }

  logoutAll(): Observable<void> {
    this.clearAuthData();
    return this.http.post<void>(`${environment.apiUrl}/logout/all`, {});
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUser(): { id: string; username: string; email: string; phone?: string } | null {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false;
  }

  private storeAuthData(token: string, user?: any): void {
    localStorage.setItem('token', token);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }
}