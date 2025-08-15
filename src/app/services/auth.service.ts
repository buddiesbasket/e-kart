import {
  computed,
  inject,
  Inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

// Shared Interfaces
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  __v?: number;
  createdAt?: string;
  refreshTokens?: string[];
}

interface AuthResponseData {
  token: string;
  user: User;
}

interface LoginResponse {
  status: string;
  data: AuthResponseData;
}

interface RegisterResponse {
  status: string;
  data: AuthResponseData;
}

interface LogoutResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Private signal to trigger updates
  private authStateChanged = signal(0);

  // Computed signals
  public isUserLoggedIn = computed(() => {
    this.authStateChanged();
    return this.getToken() !== null;
  });

  public user = computed(() => {
    this.authStateChanged();
    return this.getUser();
  });

  register(
    fullName: string,
    email: string,
    phone: string,
    password: string
  ): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${environment.apiUrl}/auth/register`, {
        name: fullName,
        email,
        phone,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.status === 'success' && response.data) {
            this.storeAuthData(
              response.data.token,
              response.data.user.refreshTokens,
              response.data.user
            );
            this.notifyAuthStateChange();
          }
        }),
        catchError((error) => {
          // this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => {
          if (response.status === 'success' && response.data) {
            this.storeAuthData(
              response.data.token,
              response.data.user.refreshTokens,
              response.data.user
            );
            this.notifyAuthStateChange();
          }
        }),
        catchError((error) => {
          this.clearAuthData();
          return throwError(() => error);
        })
      );
  }

  logout(): Observable<LogoutResponse> {
    const user = this.getUser(); // Get current user
    const token = this.getToken();
    const refreshTokens = this.getRefreshToken();
    const refreshToken =
      refreshTokens.length > 0 ? refreshTokens[0] : undefined;

    if (!user?._id) {
      this.clearAuthData();
      this.notifyAuthStateChange();
      return of({ message: 'Logged out locally (no user ID)' });
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });

    // Immediate local cleanup
    this.clearAuthData();
    this.notifyAuthStateChange();

    return this.http
      .post<LogoutResponse>(
        `${environment.apiUrl}/auth/logout`,
        {
          userId: user._id, // Send userId
          refreshToken, // Send refreshToken if available
        },
        { headers }
      )
      .pipe(
        map(resp => ({ message: resp?.message ?? 'Logged out successfully' })),
        catchError(() => of({ message: 'Logged out successfully' }))
      );
  }

  logoutAll(): Observable<LogoutResponse> {
    const user = this.getUser();
    const token = this.getToken();

    if (!user?._id) {
      this.clearAuthData();
      this.notifyAuthStateChange();
      return of({ message: 'Logged out locally (no user ID)' });
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    });

    // Immediate local cleanup
    this.clearAuthData();
    this.notifyAuthStateChange();

    return this.http
      .post<LogoutResponse>(
        `${environment.apiUrl}/auth/logout/all`,
        { userId: user._id }, // Send userId
        { headers }
      )
      .pipe(
        map(resp => ({ message: resp?.message ?? 'Logged out from all devices successfully' })),
        catchError(() =>
          of({ message: 'Logged out from all devices successfully' })
        )
      );
  }

  getToken(): string | null {
    return this.getFromStorage<string>('token');
  }

  getRefreshToken(): string[] {
    const tokens = this.getFromStorage<string[]>('refreshTokens');
    return tokens || [];
  }

  getUser(): User | null {
    return this.getFromStorage<User>('user');
  }

  private getFromStorage<T>(key: string): T | null {
    if (isPlatformBrowser(this.platformId)) {
      const item = localStorage.getItem(key);
      try {
        // For token, return directly as it's not JSON
        if (key === 'token') {
          return item as unknown as T;
        }
        // For other items, parse as JSON
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error(`Error parsing ${key} from storage:`, error);
        return null;
      }
    }
    return null;
  }

  private notifyAuthStateChange(): void {
    this.authStateChanged.update((v) => v + 1);
  }

  private storeAuthData(
    token: string,
    refreshTokens?: string[],
    user?: User
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem(
        'refreshTokens',
        JSON.stringify(refreshTokens || [])
      );
      if (user) {
        const { refreshTokens: _, ...userData } = user; // Exclude refreshTokens from user object
        localStorage.setItem('user', JSON.stringify(userData));
      }
    }
  }

  clearAuthData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshTokens');
      localStorage.removeItem('user');
    }
  }
}
